import JSZip from 'jszip'
import { getL2dAssetUrl, type L2dPathParams } from '@/utils/l2dAssetPaths'

/** Lines that are only a texture filename (Spine atlas page headers). */
export function parseAtlasTextureFilenames(atlasText: string): string[] {
  const found = new Set<string>()
  const re = /^([^\r\n]+\.(?:png|jpg|jpeg))\s*$/gim
  let m: RegExpExecArray | null
  while ((m = re.exec(atlasText)) !== null) {
    const line = m[1].trim()
    if (line.includes(':')) continue
    found.add(line)
  }
  return [...found]
}

function basenameFromUrl(url: string): string {
  const path = new URL(url).pathname
  const seg = path.split('/').pop()
  return seg || 'file'
}

export async function buildL2dAssetsZipBlob(params: L2dPathParams): Promise<Blob> {
  const skelUrl = getL2dAssetUrl('skel', params)
  const atlasUrl = getL2dAssetUrl('atlas', params)

  const [skelRes, atlasRes] = await Promise.all([fetch(skelUrl), fetch(atlasUrl)])

  if (!skelRes.ok) {
    throw new Error(`Failed to load .skel (${skelRes.status})`)
  }
  if (!atlasRes.ok) {
    throw new Error(`Failed to load .atlas (${atlasRes.status})`)
  }

  const skelBuf = await skelRes.arrayBuffer()
  const atlasText = await atlasRes.text()

  const pngNames = parseAtlasTextureFilenames(atlasText)
  const atlasDir = new URL('./', atlasUrl).href

  const zip = new JSZip()
  zip.file(basenameFromUrl(skelUrl), skelBuf)
  zip.file(basenameFromUrl(atlasUrl), atlasText)

  for (const name of pngNames) {
    const pngUrl = new URL(name, atlasDir).href
    const pngRes = await fetch(pngUrl)
    if (!pngRes.ok) {
      throw new Error(`Failed to load texture "${name}" (${pngRes.status})`)
    }
    const pngBlob = await pngRes.blob()
    const entryName = name.includes('/') ? name.replace(/^.*\//, '') : name
    zip.file(entryName, pngBlob)
  }

  return zip.generateAsync({ type: 'blob' })
}
