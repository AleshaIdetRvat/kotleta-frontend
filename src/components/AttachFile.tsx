import React, { useState, useCallback, useRef, useEffect } from "react";
import {
    FaFileArrowUp as AiFillFileAdd,
    FaFile as AiFillFile,
} from "react-icons/fa6";

type InputProps = Omit<
    React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    >,
    "onChange"
>;

interface Props extends InputProps {
    onChange: (file: File | FileList | null) => void;
}

function AttachFile({
    onChange,
    className,
    multiple,
    ...otherProps
}: Props): React.ReactElement {
    const [fileName, setFileName] = useState<string | null>(null);
    const fieldRef = useRef<HTMLDivElement>(null);

    const handleFocus = useCallback(() => {
        fieldRef.current?.classList.add("attach-file--focused");
    }, []);

    const handleBlur = useCallback(() => {
        fieldRef.current?.classList.remove("attach-file--focused");
    }, []);

    useEffect(() => {
        if (fileName) {
            fieldRef.current?.classList.add("attach-file--has-file");
        } else {
            fieldRef.current?.classList.remove("attach-file--has-file");
        }
    }, [fileName]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => {
            const fileReader = new FileReader();

            fileReader.onload = () => {
                if (fileReader.readyState === 2)
                    onChange(multiple ? e.target.files : e.target.files![0]);
            };

            const file = e.target.files?.[0];

            if (file) {
                setFileName(file.name);
                fileReader.readAsDataURL(file);
            }
        },
        [onChange],
    );

    return (
        <div
            ref={fieldRef}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="flex items-center justify-center"
        >
            <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full min-w-80 px-6 py-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
                <div className="flex flex-col items-center justify-center">
                    {fileName ? (
                        <AiFillFile className="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400" />
                    ) : (
                        <AiFillFileAdd className="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400" />
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {fileName || "Нажмите чтобы добавить файл"}
                    </p>
                </div>
                <input
                    multiple={multiple}
                    onChange={handleChange}
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    {...otherProps}
                />
            </label>
        </div>
    );
}

export default AttachFile;
