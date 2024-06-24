import { createContext, useContext, useEffect, useRef, useState } from 'react';
import ConvertList from './Convert/ConvertList';
import EditConvert from './Convert/EditConvert';
import Footer from './Footer';
import './Unifont.css'
import { InitContext } from '../App';
import { DefaultNumber, DefaultTagType, DefaultUnicodeType, FontData, Tag, Unicode } from '../../shared/dto';
import { DefaultUIConvertData, UIConvertData, UITagMap } from './dto';
import TagList from './Tag/TagList';
import EditTag from './Tag/EditTag';
import { formatFontData } from '../../shared/font';
import { isNumeric } from '../../shared/util';
import { generateConvertInfo } from '../lib/network/parseData';
import { requestToPlugin } from '../lib/network/request';
import { RequestTypes } from '../../shared/network-type';

export const UnifontContext = createContext(null);

function Unifont() {

    /* Init */
    const init = useContext(InitContext).init;
    if (init === null) return (<><span>Loading Data...</span></>);
    const fonts: FontData[] = init.fonts;

    /* Refs */
    const convertId = useRef(2);
    const tagId= useRef(9);

    /* States */
    const [page, setPage] = useState("main");
    const [tags, setTags] = useState<Tag[]>([
        {
            ...DefaultTagType,
            id: 1,
            name: "Default",
            color: "#676B76",
            unicodes: [
                {
                    ...DefaultUnicodeType,
                    type: "range",
                    from: 0,
                    to: 0x1FFFF // In fact, don't need value
                }
            ]
        },
        {
            ...DefaultTagType,
            id: 2,
            name: "Korean",
            color: "#d2d2d2",
            unicodes: [
                {
                    ...DefaultUnicodeType,
                    type: "range",
                    from: 0xAC00,
                    to: 0xD7A3 
                }
            ]
        },
        {
            ...DefaultTagType,
            id: 3,
            name: "English",
            color: "#d2d2d2",
            unicodes: [
                {
                    ...DefaultUnicodeType,
                    type: "range",
                    from: 0x0041,
                    to: 0x005A
                },
                {
                    ...DefaultUnicodeType,
                    type: "range",
                    from: 0x0061,
                    to: 0x007A
                }
            ]
        },
        {
            ...DefaultTagType,
            id: 4,
            name: "Number",
            color: "#d2d2d2",
            unicodes: [
                {
                    ...DefaultUnicodeType,
                    type: "range",
                    from: 0x0030,
                    to: 0x0039
                }
            ]
        },
        {
            ...DefaultTagType,
            id: 5,
            name: "Special Symbol",
            color: "#d2d2d2",
            unicodes: [
                {
                    ...DefaultUnicodeType,
                    type: "range",
                    from: 0x0020,
                    to: 0x002F
                },
                {
                    ...DefaultUnicodeType,
                    type: "range",
                    from: 0x003A,
                    to: 0x0040
                },
                {
                    ...DefaultUnicodeType,
                    type: "range",
                    from: 0x005B,
                    to: 0x0060
                },
                {
                    ...DefaultUnicodeType,
                    type: "range",
                    from: 0x007B,
                    to: 0x007E
                }
            ]
        },
        {
            ...DefaultTagType,
            id: 6,
            name: "English - Upper Case",
            color: "#d2d2d2",
            unicodes: [
                {
                    type: "range",
                    from: 0x0041,
                    to: 0x005A
                }
            ]
        },
        {
            ...DefaultTagType,
            id: 7,
            name: "English - Lower Case",
            color: "#d2d2d2",
            unicodes: [
                {
                    type: "range",
                    from: 0x0061,
                    to: 0x007A
                }
            ]
        },
        {
            ...DefaultTagType,
            id: 8,
            name: "Japanese",
            color: "#d2d2d2",
            unicodes: [
                // hiragana
                {
                    type: "range",
                    from: 0x3041,
                    to: 0x3096
                },
                {
                    type: "single",
                    from: 0x309D
                },
                {
                    type: "single",
                    from: 0x309E
                },
                // katakana
                {
                    type: "range",
                    from: 0x30A1,
                    to: 0x30Fa
                },
                {
                    type: "single",
                    from: 0x30FC
                }
            ]
        }
    ]);
    const tagMap = useRef<UITagMap[]>([]);

    const [defaultConvert, setDefaultConvert] = useState<UIConvertData>({
        id: 1,
        type: "default",
        tags: [1],
        font: init.selection.defaultFont
    });

    const [converts, setConverts] = useState<UIConvertData[]>([]);

    const [selected, setSelected] = useState<UIConvertData>(null);
    const [selectedTag, setSelectedTag] = useState<Tag>(null);

    /* Effects */
    useEffect(() => {
        if (selected === null) return;

        if (selected.type === "general") {
            const idx = converts.map(c => c.id).indexOf(selected.id);
            setConverts([
                ...converts.slice(0, idx),
                selected,
                ...converts.slice(idx + 1)
            ]);
        }
        else if (selected.type === "default") {
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
                type: "general",
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

    function getTagMap(id) {
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

    function addTag(id) {
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

    function deleteTag(id) {
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
                selectedTag.unicodes.filter(u => u.type === "empty").length > 0 ||
                selectedTag.unicodes.filter(u => u.type === "single" && u.from === DefaultNumber).length > 0 ||
                selectedTag.unicodes.filter(u => u.type === "range" && u.from >= u.to).length > 0
            )
        ) {
            alert("Invalid values");
            return false;
        }

        return true;
    }

    function setSelectTag(id: number) {
        if (isValidSelectedTag()) {
            setSelectedTag(tags.filter(t => t.id === id)[0]);
        }
    }

    function changeSelectedTagName(name: string) {
        setSelectedTag({
            ...selectedTag,
            name: name
        });
    }

    function changeSelectedTagColor(color: string) {
        setSelectedTag({
            ...selectedTag,
            color: color
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
        setSelectedTag({
            ...selectedTag,
            unicodes: [
                ...selectedTag.unicodes.slice(0, index),
                unicode,
                ...selectedTag.unicodes.slice(index + 1)
            ]
        });
    }

    function addTagItem() {
        if (isValidSelectedTag()) {
            const newTag: Tag = {
                ...DefaultTagType,
                id: tagId.current++
            };

            setTags([
                ...tags,
                newTag
            ]);

            setSelectedTag(newTag);
        }
    }

    function deleteTagItem() {
        if (selectedTag === null) return;

        if (confirm(
            "Tag will be delete with related fonts (If font have just one tag[" + selectedTag.name + "], delete)." + 
            "\nContinue?"
        )) {
            if (tags.length === 2) {
                alert(
                    "Must have tag at least one."
                );
                return;
            }
            const tm: UITagMap = getTagMap(selectedTag.id);

            // Delete font if have one tag that selected
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

            setSelectedTag(null);
        }
    }

    function requestConvertEntry() {
        requestToPlugin({
            type: RequestTypes.PROCESS,
            data: generateConvertInfo(defaultConvert, converts, tags, init.selection.usedFonts)
        });
    }

    return (
        <>
        <UnifontContext.Provider value={{
                page, defaultConvert, converts, tags, selected, selectedTag,
                setPage, setSelect, addConvert, deleteConvert, addTag, deleteTag, changeFont, isValidSelected, isValidSelectedTag,
                setSelectTag, changeSelectedTagName,
                changeSelectedTagColor, addSelectedTagUnicode, deleteSelectedTagUnicode, updateSelectedTagUnicode,
                addTagItem, deleteTagItem,
                requestConvertEntry
            }}>
            <div className={`container flex-row flex-grow padding ${page !== "main" ? "hidden" : ""}`}>
                <ConvertList/>
                <EditConvert/>
            </div>
            <div className={`container flex-row flex-grow padding ${page !== "tag" ? "hidden" : ""}`}>
                <TagList/>
                <EditTag/>
            </div>
            <Footer/>
        </UnifontContext.Provider>
        </>
    );
}


export default Unifont