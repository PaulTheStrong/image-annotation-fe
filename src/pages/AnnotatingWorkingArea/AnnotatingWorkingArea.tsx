import React, {useContext, useEffect, useState} from "react";
import ProjectContext from "../../context/ProjectContext";
import {AnnotatingWorkingAreaHeader} from "./AnnotatingWorkingAreaHeader";
import {AnnotatingWorkingAreaFooter} from "./AnnotatingWorkingAreaFooter";
import {AnnotationListSideBar} from "./AnnotationListSideBar/AnnotationListSideBar";
import {AnnotationQualityRightSidebar} from "./AnnotationQualityRightSidebar/AnnotationQualityRightSidebar";
import {BoundingBox} from "./DrawingArea/BoundingBox";
import Tag from "../../data/Tag";
import {AnnotatingArea} from "./DrawingArea/AnnotatingArea";
import axios from "axios";
import {BBOX_ANNOTATIONS_BASE_URL, COMMENTS_BASE_URL, PROJECT_TAGS_BASE_URL, replaceRefs} from "../../util/constants";
import Annotation from "../../data/Annotation";
import {AnnotationType} from "../../data/AnnotatoinType";
import TagsContext from "../../context/TagsContext";
import CurrentAnnotationContext from "../../context/CurrentAnnotationContext";
import ImageContext from "../../context/ImageContext";
import AnnotationImage from "../../data/AnnotationImage";
import Comment from "../../data/Comment";

interface AnnotatingWorkingAreaProps {
    currentImage: AnnotationImage;
}

const createAnnotationFromData = (data: any, tags: Tag[], type: AnnotationType): Annotation => {
    switch (type) {
        case AnnotationType.BOUNDING_BOX:
            return createBBoxFromData(data, tags);
    }
    throw 42;
}

const createBBoxFromData = (data: any, tags: Tag[]) => {
    return new BoundingBox(
        data.boundingBox.x1,
        data.boundingBox.y1,
        data.boundingBox.x2,
        data.boundingBox.y2,
        data.annotationTagId,
        tags.filter(tag => tag.id === data.annotationTagId)[0].color,
        data.annotationId);
}

export const AnnotatingWorkingArea: React.FC<AnnotatingWorkingAreaProps> = ({currentImage}) => {

    const projectId = useContext<number>(ProjectContext);

    const [isShowQualitySection, setIsShowQualitySection] = useState(true)
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [currentTag, setCurrentTag] = useState<Tag>();
    const [currentAnnotation, setCurrentAnnotation] = useState<Annotation>();
    const [comments, setComments] = useState<Comment[]>(currentImage.comments);

    const handleAnnotationAdd = (annotation: Annotation) => {
        switch (annotation.annotationType) {
            case AnnotationType.BOUNDING_BOX:
                return handleBoundingBoxAdd(annotation as BoundingBox);
        }
        throw "Cannot add this annotation";
    }

    const handleAnnotationUpdate = (annotation: Annotation) => {
        switch (annotation.annotationType) {
            case AnnotationType.BOUNDING_BOX:
                return handleBoundingBoxUpdate(annotation as BoundingBox);
        }
        throw "Cannot add this annotation";

    }

    const handleBoundingBoxAdd = (bbox: BoundingBox) => {
        return axios.post(BBOX_ANNOTATIONS_BASE_URL.replace("{imageId}", currentImage.id!.toString()), {
            annotationTagId: bbox.tagId,
            boundingBox: {
                x1: bbox.data.xStart,
                y1: bbox.data.yStart,
                x2: bbox.data.xEnd,
                y2: bbox.data.yEnd
            }
        }).then(res => {
            const data = res.data;
            const newBoundingBox = new BoundingBox(
                data.boundingBox.x1,
                data.boundingBox.y1,
                data.boundingBox.x2,
                data.boundingBox.y2,
                data.annotationTagId,
                bbox.color,
                data.annotationId);
            setAnnotations(prevState => [...prevState, newBoundingBox]);
            setCurrentTag(undefined);
        });
    };

    const handleBoundingBoxUpdate = (bbox: BoundingBox) => {
        return axios.put(BBOX_ANNOTATIONS_BASE_URL.replace("{imageId}", currentImage.id!.toString()) + "/" + bbox.id!.toString(), {
            boundingBox: {
                x1: bbox.data.xStart,
                y1: bbox.data.yStart,
                x2: bbox.data.xEnd,
                y2: bbox.data.yEnd
            }
        }).then(res => {
            const data = res.data;
            const updatedBox = new BoundingBox(
                data.boundingBox.x1,
                data.boundingBox.y1,
                data.boundingBox.x2,
                data.boundingBox.y2,
                data.annotationTagId,
                bbox.color,
                data.annotationId);
            setAnnotations(prevState => prevState.map(
                box => box.id === updatedBox.id ? updatedBox : box
            ));
            setCurrentTag(undefined);
        })
    }

    const handleTagClick = (tag: Tag) => {
        if (currentTag?.id === tag.id) {
            setCurrentTag(undefined);
        } else {
            setCurrentTag(tag);
        }
    };

    useEffect(() => {
        axios.get<any[]>(BBOX_ANNOTATIONS_BASE_URL.replace("{imageId}", currentImage.id!.toString()))
            .then(res => res.data).then((annotations) => {
            axios.get<Tag[]>(PROJECT_TAGS_BASE_URL.replace("{projectId}", projectId.toString())).then((res) => {
                const tags = res.data as Tag[];
                setTags(tags);
                setAnnotations(annotations.map(annotation => createAnnotationFromData(annotation, tags, AnnotationType.BOUNDING_BOX)));
            });
        })
    }, [currentImage.id, projectId]);

    const pickAnnotation = (annotation?: Annotation) => {
        setCurrentAnnotation(annotation);
    }

    const handleAddComment = (comment: Comment) => {
        axios.post(replaceRefs(COMMENTS_BASE_URL, {projectId: projectId, imageId: currentImage.id}), comment)
            .then(res => setComments(prev => [res.data, ...prev]));
    }

    const handleResolveComment = (comment: Comment) => {
        axios.put(replaceRefs(COMMENTS_BASE_URL, {projectId: projectId, imageId: currentImage.id}) + `/${comment.id}/resolve?isResolved=${comment.isResolved}`)
            .then(() => setComments(prev => prev.map(com => com.id === comment.id ? comment : com)));
    }

    return (
        <div className="annotationWorkingArea">
            <TagsContext.Provider value={new Map(tags.map(tag => [tag.id!, tag]))}>
                <CurrentAnnotationContext.Provider value={currentAnnotation}>
                    <ImageContext.Provider value={currentImage.id!}>
                        <AnnotatingWorkingAreaHeader/>
                        <div className="annotationWorkingAreaBody">
                            <AnnotationListSideBar annotations={annotations}/>
                            <AnnotatingArea
                                annotations={annotations}
                                onAnnotationAdd={handleAnnotationAdd}
                                onAnnotationRemove={() => {
                                    throw 42
                                }}
                                onAnnotationUpdate={handleAnnotationUpdate}
                                onTagClick={handleTagClick}
                                currentTag={currentTag}
                                onAnnotationPick={pickAnnotation}
                            />
                            {isShowQualitySection && <AnnotationQualityRightSidebar comments={comments} onCommentAdd={handleAddComment} onStatusChange={handleResolveComment}/>}
                        </div>
                        <AnnotatingWorkingAreaFooter/>
                    </ImageContext.Provider>
                </CurrentAnnotationContext.Provider>
            </TagsContext.Provider>
        </div>
    )
}
