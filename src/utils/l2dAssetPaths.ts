import { globalParams } from '@/utils/enum/globalParams'

export type L2dPose = 'fb' | 'aim' | 'cover' | 'temp'

export interface L2dPathParams {
  current_id: string
  current_pose: L2dPose
  f: string
}

/**
 * Same rules as Spine Loader `getPathing` — CDN URL for .skel / .atlas (and derived texture paths).
 */
export function getL2dAssetUrl(extension: string, params: L2dPathParams): string {
  let route = globalParams.PATH_L2D + params.current_id + '/'
  let fileSuffix = '_00'

  switch (params.current_pose) {
    case 'aim':
      route += globalParams.PATH_L2D_AIM
      fileSuffix = '_aim' + fileSuffix
      break
    case 'cover':
      route += globalParams.PATH_L2D_COVER
      fileSuffix = '_cover' + fileSuffix
      break
    default:
      break
  }

  const f = params.f !== '' ? params.f : params.current_id + fileSuffix
  route += f + '.' + extension

  return route
}
