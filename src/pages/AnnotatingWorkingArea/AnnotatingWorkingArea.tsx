import React, {useContext, useEffect, useState} from "react";
import ProjectContext from "../../context/ProjectContext";
import {BoundingBoxCanvas} from "./DrawingArea/BoundingBoxCanvas";
import {AnnotatingWorkingAreaHeader} from "./AnnotatingWorkingAreaHeader";
import {AnnotatingWorkingAreaFooter} from "./AnnotatingWorkingAreaFooter";
import {AnnotationListSideBar} from "./AnnotationListSideBar";
import {AnnotationQualityRightSidebar} from "./AnnotationQualityRightSidebar";
import {BoundingBox} from "./DrawingArea/BoundingBox";
import Tag from "../../data/Tag";
import {AnnotatingArea} from "./DrawingArea/AnnotatingArea";
import axios from "axios";
import {BBOX_ANNOTATIONS_BASE_URL, PROJECT_TAGS_BASE_URL} from "../../util/constants";

interface AnnotatingWorkingAreaProps {
    imageId: number;
}

export const AnnotatingWorkingArea: React.FC<AnnotatingWorkingAreaProps> = ({imageId}) => {

    const projectId = useContext<number>(ProjectContext);
    const [isShowQualitySection, setIsShowQualitySection] = useState(true)
    const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [currentTag, setCurrentTag] = useState<Tag>()

    const handleBoundingBoxAdd = (bbox: BoundingBox) => {
        return axios.post(BBOX_ANNOTATIONS_BASE_URL.replace("{imageId}", imageId.toString()), {
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
            setBoundingBoxes(prevState => [...prevState, newBoundingBox]);
            setCurrentTag(undefined);
        });
    };

    const handleBoundingBoxUpdate = (bbox: BoundingBox) => {
        return axios.put(BBOX_ANNOTATIONS_BASE_URL.replace("{imageId}", imageId.toString()) + "/" + bbox.id!.toString(), {
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
            setBoundingBoxes(prevState => prevState.map(
                box => box.id === updatedBox.id ? updatedBox : box
            ));
            setCurrentTag(undefined);
        })
    }

    const handleTagUpdate = (tag: Tag) => {
        setBoundingBoxes([...boundingBoxes]);
    }

    const handleTagRemove = (removedTag: Tag) => {
        axios.delete(PROJECT_TAGS_BASE_URL + "/" + removedTag.id)
            .then((res) => {
                setTags(prevState => prevState.filter(tag => removedTag.id !== tag.id));
                setBoundingBoxes(prevBoxes => prevBoxes.filter(box => box.tagId !== removedTag.id));
                if (currentTag && removedTag.id === currentTag.id) {
                    setCurrentTag(undefined);
                }
            });
    }

    const handleTagAdd = (newTag: Tag) => {
        axios.post(PROJECT_TAGS_BASE_URL, newTag)
            .then((res) => {
                setTags(oldValue => [...oldValue, res.data]);
            });
    }

    const handleTagClick = (tag: Tag) => {
        if (currentTag?.id === tag.id) {
            setCurrentTag(undefined);
        } else {
            setCurrentTag(tag);
        }
    };

    useEffect(() => {
        axios.get<any[]>(BBOX_ANNOTATIONS_BASE_URL.replace("{imageId}", imageId.toString()))
            .then(res => res.data).then((boundingBoxes) => {
            axios.get<Tag[]>(PROJECT_TAGS_BASE_URL).then((res) => {
                setTags(res.data);
                setBoundingBoxes(boundingBoxes.map(bbox => new BoundingBox(
                    bbox.boundingBox.x1,
                    bbox.boundingBox.y1,
                    bbox.boundingBox.x2,
                    bbox.boundingBox.y2,
                    bbox.annotationTagId,
                    res.data.filter(tag => tag.id === bbox.annotationTagId)[0].color,
                    bbox.annotationId)));
            })
        })
    }, [imageId]);

    useEffect(() => {
            axios.get<Tag[]>(PROJECT_TAGS_BASE_URL.replace("{projectId}", projectId.toString()))
                .then((res) => setTags(res.data))
    }, [projectId])

    return (
        <div className="annotationWorkingArea">
            <AnnotatingWorkingAreaHeader/>
            <div className="annotationWorkingAreaBody">
                <AnnotationListSideBar imageId={imageId}/>
                <AnnotatingArea imageId={imageId}
                                boundingBoxes={boundingBoxes}
                                onBoundingBoxAdd={handleBoundingBoxAdd}
                                onBoundingBoxRemove={() => {throw 42}}
                                onBoundingBoxUpdate={handleBoundingBoxUpdate}
                                onTagAdd={handleTagAdd}
                                onTagClick={handleTagClick}
                                onTagRemove={handleTagRemove}
                                onTagUpdate={handleTagUpdate}
                                tags={tags}
                                currentTag={currentTag}
                />
                {isShowQualitySection && <AnnotationQualityRightSidebar imageId={imageId}/>}
            </div>
            <AnnotatingWorkingAreaFooter/>
        </div>
    )
}
