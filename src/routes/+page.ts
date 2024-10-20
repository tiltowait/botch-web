import type { PageLoad } from './$types'
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = async () => {
  redirect(307, 'https://github.com/tiltowait/botch-web')
}
