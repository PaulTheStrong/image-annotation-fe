export const HOST = process.env.BACKEND_HOST || 'http://localhost:8080';

export const PROJECT_TAGS_BASE_URL = HOST + "/projects/{projectId}/tags";
export const PROJECT_IMAGES_BASE_URL = HOST + "/projects/{projectId}/images";
export const BBOX_ANNOTATIONS_BASE_URL = HOST + "/annotations/bbox";
export const POLYGON_ANNOTATIONS_BASE_URL = HOST + "/annotations/polygon";
export const PROJECTS_BASE_URL = HOST + "/projects"
export const COMMENTS_BASE_URL = HOST + "/projects/{projectId}/images/{imageId}/comments";

export function replaceRefs(str: string, obj: any) {
    return str.replace(/{(\w+)}/g, (match, key) => {
        return obj.hasOwnProperty(key) ? obj[key] : match;
    });
}
