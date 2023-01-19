// import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { fs } from '@tauri-apps/api';

import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    return json({
        field_types: ["d"],
    })
};

