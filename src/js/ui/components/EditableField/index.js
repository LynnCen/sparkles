import React, { useEffect, useState } from "react";
import { Input } from "antd";
import { EditIcon2 } from "../../icons";
import Edit from "images/icons/edit.png";

const styleEllipse = {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
};

const EditableField = ({
    isOwner,
    onChange,
    value: defaultFieldName,
    ignoreEmpty = true,
    maxWidth = 200,
    maxLength = 50,
    overlayIconStyle = {},
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [fieldName, setFieldName] = useState(defaultFieldName);

    useEffect(() => {
        setFieldName(defaultFieldName);
    }, [defaultFieldName]);

    const onEdit = () => setIsEditing((prevState) => !prevState);

    const onEnter = (e) => {
        const { value } = e.target;
        setFieldName(value.trim() || defaultFieldName);

        if (ignoreEmpty && !value.trim()) {
            return onEdit();
        }
        return onChange(value.trim()).then(onEdit);
    };

    const onBlur = () => {
        onEdit();
        setFieldName(defaultFieldName);
    };

    const onChangeGroupName = (e) => {
        const { value } = e.target;
        setFieldName(value);
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "flex-end",
                width: `${isEditing ? "100%" : "auto"}`,
                margin: "0 auto",
            }}
        >
            {!isOwner ? (
                <span style={{ ...styleEllipse, maxWidth: maxWidth }}>{fieldName}</span>
            ) : isEditing ? (
                <Input
                    value={fieldName}
                    onChange={onChangeGroupName}
                    onPressEnter={onEnter}
                    maxLength={maxLength}
                    autoFocus={true}
                    onBlur={onBlur}
                />
            ) : (
                <React.Fragment>
                    <span style={{ ...styleEllipse, maxWidth: maxWidth - 20 }}>{fieldName}</span>
                    <span onClick={onEdit} style={{ lineHeight: "16px", cursor: "pointer" }}>
                        <EditIcon2
                            bodyStyle={{
                                color: "var(--icon-color-normal)",
                                width: 16,
                                height: 17,
                                marginLeft: 8,
                                ...overlayIconStyle,
                            }}
                        />
                    </span>
                </React.Fragment>
            )}
        </div>
    );
};

export default EditableField;
