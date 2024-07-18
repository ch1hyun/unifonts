import { createContext, useContext, useEffect, useRef, useState } from 'react';
import ConvertList from './Convert/ConvertList';
import EditConvert from './Convert/EditConvert';
import Footer from './Footer';
import { InitContext } from '../App';
import { DefaultNumber, DefaultTagType, FontData, Tag, TagType, Unicode, UnicodeType } from '../../shared/dto';
import { DefaultUIConvertData, UIConvertData, UIConvertType, UITagMap } from './dto';
import TagList from './Tag/TagList';
import EditTag from './Tag/EditTag';
import { generateConvertInfo } from '../lib/network/parseData';
import { getInitialTagData } from './InitData/initDataProvider';
import './Unifont.css'
import { sha256 } from '../lib/crypto';
import { requestToPlugin } from '../lib/network/request';
import { RequestTypes } from '../../shared/network-type';

export const UnifontContext = createContext(null);

function Unifont() {

    /* Init */

    const init = useContext(InitContext).init;
    if (init === null) return (<><span>Loading Data...</span></>);
    const fonts: FontData[] = init.fonts;
    const process = useContext(InitContext).process;

    /* Refs */

    const convertId = useRef(2);
    const tagMap = useRef<UITagMap[]>([]);

    /* States */

    const [page, setPage] = useState("main");
    const [tags, setTags] = useState<Tag[]>([]);
    const [defaultConvert, setDefaultConvert] = useState<UIConvertData>({
        id: 1,
        type: UIConvertType.Default,
        tags: [],
        font: init.selection.defaultFont
    });
    const [converts, setConverts] = useState<UIConvertData[]>([]);
    const [selected, setSelected] = useState<UIConvertData>(null);
    const [selectedTag, setSelectedTag] = useState<Tag>(null);

    /* Effects */

    useEffect(() => {
        let initTags: Tag[] = getInitialTagData();
        setTags(initTags.concat(init.tags as Tag[]));
        setDefaultConvert({
            ...defaultConvert,
            tags: [initTags[0].id]
        });
    }, []);

    useEffect(() => {
        if (selected === null) return;

        if (selected.type === UIConvertType.General) {
            const idx = converts.map(c => c.id).indexOf(selected.id);
            setConverts([
                ...converts.slice(0, idx),
                selected,
                ...converts.slice(idx + 1)
            ]);
        }
        else if (selected.type === UIConvertType.Default) {
            setDefaultConvert(selected);
        }
    }, [selected]);

    useEffect(() => {
        if (selectedTag === null) return;

        const idx = tags.map(t => t.id).indexOf(selectedTag.id);

        if (selectedTag === tags.at(idx)) return;

        setTags([
            ...tags.slice(0, idx),
            selectedTag,
            ...tags.slice(idx + 1)
        ]);
    }, [selectedTag]);

    useEffect(() => {
        setSelected(null);
        setSelectedTag(null);
    }, [page]);

    /* Handler Functions */

    function isValidSelected(): boolean {
        if (selected !== null && selected.tags.length === 0) {
            alert("Must select tag at least 1.");
            return false;
        }

        return true;
    }

    function setSelect(id: number) {
        if (selected !== null && selected.id === id) return;
        if (selected !== null && !isValidSelected()) {
            return;
        }

        if (defaultConvert.id === id) {
            setSelected(defaultConvert);
            return;
        }

        const search = converts.filter(c => c.id === id);
        if (search.length === 1) {
            setSelected(search[0]);
        }
    }

    function addConvert() {
        if (isValidSelected()) {
            const newItem: UIConvertData = {
                ...DefaultUIConvertData,
                id: convertId.current++,
                type: UIConvertType.General,
                font: defaultConvert.font
            };

            setConverts(c => [
                ...c,
                newItem
            ]);

            setSelected(newItem);
        }
    }

    function deleteConvert(convertId: number) {
        if (convertId === 1) return;

        const idx = converts.map(c => c.id).indexOf(convertId);
        setConverts([
            ...converts.slice(0, idx),
            ...converts.slice(idx + 1)
        ]);

        setSelected(null);
    }

    function getTagMap(id: string) {
        let res = tagMap.current.filter(tm => tm.tagId === id);

        if (res.length === 0) {
            tagMap.current.push({
                tagId: id,
                convertDataId: []
            });

            return tagMap.current[tagMap.current.length - 1];
        }

        return res[0];
    }

    function addTag(id: string) {
        if (selected === null) return;
        if (selected.tags.filter(tagId => tagId === id).length !== 0) return;

        setSelected({
            ...selected,
            tags: [
                ...selected.tags,
                tags.filter(t => t.id === id)[0].id
            ]
        });

        getTagMap(id).convertDataId.push(selected.id);
    }

    function deleteTag(id: string) {
        if (selected === null) return;

        const idx = selected.tags.indexOf(id);

        setSelected({
            ...selected,
            tags: [
                ...selected.tags.slice(0, idx),
                ...selected.tags.slice(idx + 1)
            ]
        });

        const tm = getTagMap(id);
        const tmIdx = tm.convertDataId.indexOf(selected.id);
        tm.convertDataId = [
            ...tm.convertDataId.slice(0, tmIdx),
            ...tm.convertDataId.slice(tmIdx + 1)
        ];
    }

    function changeFont(fontId: number) {
        if (selected === null) return;

        const findFont = fonts.filter(f => f.id === fontId);
        if (findFont.length === 0) return;

        const font: FontData = findFont[0];

        setSelected({
            ...selected,
            font: font
        });
    }

    function isValidSelectedTag(): boolean {
        if (
            selectedTag !== null &&
            (
                selectedTag.name.length === 0 ||
                selectedTag.unicodes.filter(u => u.type === UnicodeType.Empty).length > 0 ||
                selectedTag.unicodes.filter(u => u.type === UnicodeType.Single && u.from === DefaultNumber).length > 0 ||
                selectedTag.unicodes.filter(u => u.type === UnicodeType.Range && u.from >= u.to).length > 0
            )
        ) {
            alert("Invalid values");
            return false;
        }

        return true;
    }

    function setSelectTag(id: string) {
        if (isValidSelectedTag()) {
            setSelectedTag(tags.filter(t => t.id === id)[0]);
        }
    }

    function changeSelectedTagName(name: string) {
        const newTag: Tag = {
            ...selectedTag,
            name: name
        };

        setSelectedTag(newTag);

        // TODO : Synchronize with client storage
        requestToPlugin({
            type: RequestTypes.UPDATE_TAG,
            data: newTag
        });
    }

    function changeSelectedTagColor(color: string) {
        const newTag: Tag = {
            ...selectedTag,
            color: color
        };

        setSelectedTag(newTag);

        // TODO : Synchronize with client storage
        requestToPlugin({
            type: RequestTypes.UPDATE_TAG,
            data: newTag
        });
    }

    function addSelectedTagUnicode(unicode: Unicode) {
        setSelectedTag({
            ...selectedTag,
            unicodes: [
                ...selectedTag.unicodes,
                unicode
            ]
        });
    }

    function deleteSelectedTagUnicode(index: number) {
        if (selectedTag.unicodes.length === 1) {
            alert("Tag must have unicode at least one.");
            return;
        }

        setSelectedTag({
            ...selectedTag,
            unicodes: [
                ...selectedTag.unicodes.slice(0, index),
                ...selectedTag.unicodes.slice(index + 1)
            ]
        });
    }

    function updateSelectedTagUnicode(index: number, unicode: Unicode) {
        const newTag: Tag = {
            ...selectedTag,
            unicodes: [
                ...selectedTag.unicodes.slice(0, index),
                unicode,
                ...selectedTag.unicodes.slice(index + 1)
            ]
        };

        setSelectedTag(newTag);

        // TODO : Synchronize with client storage
        requestToPlugin({
            type: RequestTypes.UPDATE_TAG,
            data: newTag
        });
    }

    function addTagItem() {
        if (isValidSelectedTag()) {
            const newTag: Tag = {
                ...DefaultTagType,
                id: sha256(new Date().toUTCString()),
                type: TagType.Custom
            };

            setTags([
                ...tags,
                newTag
            ]);

            setSelectedTag(newTag);

            // TODO : Synchronize with client storage
            requestToPlugin({
                type: RequestTypes.ADD_TAG,
                data: newTag
            });
        }
    }

    function deleteTagItem() {
        if (selectedTag === null) return;

        if (confirm(
            "Tag will be delete with related fonts (If font have just one tag[" + selectedTag.name + "], delete)." + 
            "\nContinue?"
        )) {
            const tm: UITagMap = getTagMap(selectedTag.id);

            // If convert item have one tag that same with selected tag, delete convert item
            // else delete selected tag and push
            const newConverts: UIConvertData[] = [];
            converts.map(c => {
                if (tm.convertDataId.indexOf(c.id) !== -1) {
                    if (c.tags.length === 1) return;
                    newConverts.push({
                        ...c,
                        tags: c.tags.filter(t => t !== selectedTag.id)
                    });
                } else {
                    newConverts.push(c);
                }
            })

            setConverts(newConverts);

            // Delete connection information
            const tmIdx = tagMap.current.map(t => t.tagId).indexOf(selectedTag.id);
            tagMap.current = [
                ...tagMap.current.slice(0, tmIdx),
                ...tagMap.current.slice(tmIdx + 1)
            ];

            // Delete actual tag
            const tagIdx = tags.map(t => t.id).indexOf(selectedTag.id);
            setTags([
                ...tags.slice(0, tagIdx),
                ...tags.slice(tagIdx + 1)
            ]);

            // TODO : Synchronize with client storage
            requestToPlugin({
                type: RequestTypes.DELETE_TAG,
                data: selectedTag
            });

            setSelectedTag(null);
        }
    }

    function requestConvertEntry() {
        process(
            generateConvertInfo(defaultConvert, converts, tags, init.selection.usedFonts)
        );
    }

    /* Returns */

    let ret = (<><p>Error</p></>);

    if (page === "main") {
        ret = (
            <>
            <UnifontContext.Provider value={{
                    page, defaultConvert, converts, tags, selected, selectedTag,
                    setPage, setSelect, addConvert, deleteConvert, addTag, deleteTag, changeFont, isValidSelected, isValidSelectedTag,
                    setSelectTag, changeSelectedTagName,
                    changeSelectedTagColor, addSelectedTagUnicode, deleteSelectedTagUnicode, updateSelectedTagUnicode,
                    addTagItem, deleteTagItem,
                    requestConvertEntry
                }}>
                <div className={`container flex-row flex-grow padding`}>
                    <ConvertList/>
                    <EditConvert/>
                </div>
                <Footer/>
            </UnifontContext.Provider>
            </>
        );
    } else if (page === "tag") {
        ret = (
            <>
            <UnifontContext.Provider value={{
                    page, defaultConvert, converts, tags, selected, selectedTag,
                    setPage, setSelect, addConvert, deleteConvert, addTag, deleteTag, changeFont, isValidSelected, isValidSelectedTag,
                    setSelectTag, changeSelectedTagName,
                    changeSelectedTagColor, addSelectedTagUnicode, deleteSelectedTagUnicode, updateSelectedTagUnicode,
                    addTagItem, deleteTagItem,
                    requestConvertEntry
                }}>
                <div className={`container flex-row flex-grow padding`}>
                    <TagList/>
                    <EditTag/>
                </div>
                <Footer/>
            </UnifontContext.Provider>
            </>
        );
    }

    return (
        <>
        {ret}
        </>
    );
}


export default Unifont