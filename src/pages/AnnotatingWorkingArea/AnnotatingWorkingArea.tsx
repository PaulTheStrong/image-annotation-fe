import React, {useEffect, useState} from "react";
import {AnnotatingWorkingAreaHeader} from "./AnnotatingWorkingAreaHeader";
import {AnnotationListSideBar} from "./AnnotationListSideBar/AnnotationListSideBar";
import {AnnotationQualityRightSidebar} from "./AnnotationQualityRightSidebar/AnnotationQualityRightSidebar";
import {BoundingBox} from "../../data/BoundingBox";
import Tag from "../../data/Tag";
import {AnnotatingArea} from "./DrawingArea/AnnotatingArea";
import axios from "axios";
import {
    BBOX_ANNOTATIONS_BASE_URL,
    COMMENTS_BASE_URL, HOST,
    POLYGON_ANNOTATIONS_BASE_URL,
    PROJECT_TAGS_BASE_URL,
    replaceRefs
} from "../../util/constants";
import Annotation from "../../data/Annotation";
import {AnnotationType} from "../../data/AnnotatoinType";
import TagsContext from "../../context/TagsContext";
import CurrentAnnotationContext from "../../context/CurrentAnnotationContext";
import ImageContext from "../../context/ImageContext";
import AnnotationImage from "../../data/AnnotationImage";
import Comment from "../../data/Comment";
import {useParams} from "react-router-dom";
import {PolygonAnnotation} from "../../data/PolygonAnnotation";
import {createBBoxFromData, handleBBoxAddReq, sendBboxUpdateReq} from "./DrawingArea/requests/BboxRequests";
import {createPolygonFromData, handlePolygonAddReq, sendPolygonUpdateReq} from "./DrawingArea/requests/PolygonRequests";

interface AnnotatingWorkingAreaProps {
    currentImage: AnnotationImage;
    onCurrentImageUpdated: (annotationImage: AnnotationImage) => void;
}

const createAnnotationFromData = (data: any, tags: Tag[], type: AnnotationType): Annotation => {
    switch (type) {
        case AnnotationType.BOUNDING_BOX:
            return createBBoxFromData(data, tags);
        case AnnotationType.POLYGON:
            return createPolygonFromData(data, tags);
    }
    throw new Error(`No such annotation type ${type}`);
}

export const AnnotatingWorkingArea: React.FC<AnnotatingWorkingAreaProps> = ({currentImage, onCurrentImageUpdated}) => {

    const projectId = Number(useParams<{ projectId: string }>().projectId);

    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [currentTag, setCurrentTag] = useState<Tag>();
    const [currentAnnotation, setCurrentAnnotation] = useState<Annotation>();
    const [currentAnnotationType, setCurrentAnnotationType] = useState<AnnotationType | undefined>()
    const [comments, setComments] = useState<Comment[]>(currentImage.comments);

    const imageId = currentImage.id;

    const handleAnnotationAdd = async (annotation: Annotation) => {
        let added: Annotation | undefined = undefined;
        switch (annotation.annotationType) {
            case AnnotationType.BOUNDING_BOX:
                added = await handleBBoxAddReq(annotation as BoundingBox, imageId!);
                break;
            case AnnotationType.POLYGON:
                added = await handlePolygonAddReq(annotation as PolygonAnnotation, imageId!);
                break;
        }

        if (added) {
            setAnnotations(prevState => [...prevState, added!]);
            setCurrentTag(undefined);
        }
    }

    const handleAnnotationUpdate = async (annotation: Annotation) => {
        let updated: Annotation | undefined = undefined;
        switch (annotation.annotationType) {
            case AnnotationType.BOUNDING_BOX:
                updated = await sendBboxUpdateReq(annotation as BoundingBox, imageId!);
                break;
            case AnnotationType.POLYGON :
                updated = await sendPolygonUpdateReq(annotation as PolygonAnnotation, imageId!);
                break;
        }
        if (updated !== undefined) {
            setAnnotations(prevState => prevState.map(annotation => annotation.id === updated!.id ? updated! : annotation));
        }
    }

    const handleTagClick = (tag: Tag) => {
        if (currentTag?.id === tag.id) {
            setCurrentTag(undefined);
        } else {
            setCurrentTag(tag);
        }
    };

    useEffect(() => {

        const tmpAnnotations: Annotation[] = [];
        const addAnnotationsToArray = (data: any[], tags: Tag[], annotationType: AnnotationType) => {
            tmpAnnotations.push(...data.map(annotation => createAnnotationFromData(annotation, tags, annotationType)));
        }

        const fetchData = async () => {
            let response = await axios.get<Tag[]>(PROJECT_TAGS_BASE_URL.replace("{projectId}", projectId.toString()));
            let tags = await response.data;
            let commentsResponse = await axios.get<Comment[]>(replaceRefs(COMMENTS_BASE_URL, {projectId, imageId}));
            await addAnnotationsToArray((await axios.get<any[]>(`${BBOX_ANNOTATIONS_BASE_URL}/${imageId}`)).data, tags, AnnotationType.BOUNDING_BOX);
            await addAnnotationsToArray((await axios.get<any[]>(`${POLYGON_ANNOTATIONS_BASE_URL}/${imageId}`)).data, tags, AnnotationType.POLYGON);
            setTags(tags);
            setComments(commentsResponse.data);
            setAnnotations(tmpAnnotations);
        }

        fetchData();
    }, [imageId, projectId]);

    useEffect(() => {
        if (tags.length === 0) return;

    }, [annotations, imageId, tags])

    const pickAnnotation = (annotation?: Annotation) => {
        setCurrentAnnotation(annotation);
        setCurrentAnnotationType(annotation?.annotationType);
    }

    const handleAddComment = async (comment: Comment) => {
        let res = await axios.post(replaceRefs(COMMENTS_BASE_URL, {projectId: projectId, imageId: imageId}), comment);
        setComments(prev => [res.data, ...prev]);
    }

    const handleResolveComment = async (comment: Comment) => {
        await axios.put(replaceRefs(COMMENTS_BASE_URL, {
            projectId: projectId,
            imageId: imageId
        }) + `/${comment.id}/resolve?isResolved=${comment.isResolved}`);
        setComments(prev => prev.map(com => com.id === comment.id ? comment : com));
    }

    const deleteCurrentAnnotation = async () => {
        if (currentAnnotation) {
            switch (currentAnnotationType) {
                case AnnotationType.BOUNDING_BOX:
                    await axios.delete(`${BBOX_ANNOTATIONS_BASE_URL}/${imageId}/${currentAnnotation.id}`);
                    break;
                case AnnotationType.POLYGON:
                    await axios.delete(`${POLYGON_ANNOTATIONS_BASE_URL}/${imageId}/${currentAnnotation.id}`)
                    break;
            }
            setAnnotations(prev => prev.filter(annotation => annotation.id !== currentAnnotation.id))
            setCurrentAnnotation(undefined);
            setCurrentAnnotationType(undefined);
        }
    }

    const updateImageStatus = async (statusId: number) => {
        let status;
        switch (statusId) {
            case 0:
                status = "IN_PROGRESS"
                break;
            case 1:
                status = "DONE";
                break;
            case 2:
                status = "APPROVED";
                break;
            default:
                throw new Error("Status not found");
        }
        await axios.patch(`${HOST}/projects/${projectId}/images/${imageId}/status/${status}`);
        currentImage.status = statusId;
        onCurrentImageUpdated(currentImage);
    }

    return (
        <div className="annotationWorkingArea">
            <TagsContext.Provider value={new Map(tags.map(tag => [tag.id!, tag]))}>
                <CurrentAnnotationContext.Provider value={currentAnnotation}>
                    <ImageContext.Provider value={imageId!}>
                        <AnnotatingWorkingAreaHeader
                            currentAnnotationType={currentAnnotationType}
                            onAnnotationTypeChange={setCurrentAnnotationType}
                            onDelete={deleteCurrentAnnotation}
                        />
                        <div className="annotationWorkingAreaBody">
                            <AnnotationListSideBar annotations={annotations}/>
                            <AnnotatingArea
                                annotations={annotations}
                                currentAnnotationType={currentAnnotationType}
                                onAnnotationAdd={handleAnnotationAdd}
                                onAnnotationRemove={() => {
                                    throw new Error("Not implemented")
                                }}
                                onAnnotationUpdate={handleAnnotationUpdate}
                                onTagClick={handleTagClick}
                                currentTag={currentTag}
                                onAnnotationPick={pickAnnotation}
                            />
                            <AnnotationQualityRightSidebar
                                comments={comments}
                                onCommentAdd={handleAddComment}
                                onCommentStatusChange={handleResolveComment}
                                currentStatus={currentImage.status}
                                onStatusChange={updateImageStatus}/>
                        </div>
                    </ImageContext.Provider>
                </CurrentAnnotationContext.Provider>
            </TagsContext.Provider>
        </div>
    )
}
