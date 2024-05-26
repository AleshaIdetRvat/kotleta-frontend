import { findQuarriesApi } from "@/services/api/findQuarries";
import { pluralize } from "@/utils/pluralizeText";
import { useQuery } from "@tanstack/react-query";
import { CSSProperties, useMemo, useState } from "react";

type Props = {
    imageSrc: string | null;
    imageName?: string;
};

/* TODO
порог достоверности — это минимальный балл, при котором модель будет считать прогноз истинным
*/

export const ImageContainer = (props: Props) => {
    const [confidenceTreshold, setConfidenceTreshold] = useState(40);
    const imageQuery = useQuery({
        queryKey: ["find-quarries", props.imageName],
        queryFn: () => findQuarriesApi(props.imageSrc),
        refetchOnWindowFocus: false,
        enabled: !!props.imageSrc,
    });

    const imagePredictions = useMemo(() => {
        return imageQuery.data?.predictions
            .map((prediction) => {
                const imageWidth = imageQuery.data?.image.width || 0;
                const imageHeight = imageQuery.data?.image.height || 0;
                const predictionLeft = prediction.x / (imageWidth / 100);
                const predictionTop = prediction.y / (imageHeight / 100);
                const predictionWidth = prediction.width / (imageWidth / 100);
                const predictionHeight = prediction.height / (imageHeight / 100);
                const percent = Math.round(prediction.confidence * 100);

                const style: CSSProperties = {
                    height: `${predictionHeight}%`,
                    width: `${predictionWidth}%`,
                    left: `${predictionLeft}%`,
                    top: `${predictionTop}%`,
                    translate: "-50% -50%",
                };

                return {
                    ...prediction,
                    style,
                    percent,
                };
            })
            .filter((prediction) => prediction.percent >= confidenceTreshold);
    }, [confidenceTreshold, imageQuery.data]);

    const hasPredictions =
        !imageQuery.isLoading && !imageQuery.isError && !!imagePredictions?.length;

    const containerClassName =
        "relative transition-all rounded-lg h-[40rem]  border-gray-300 border-solid";

    const predictionsCount = imagePredictions?.length || 0;

    const totalCountText = pluralize(predictionsCount, [
        `обноружен ${predictionsCount} объект`,
        `обноружено ${predictionsCount} объекта`,
        `обноружено ${predictionsCount} объектов`,
    ]);

    return (
        <>
            <div>
                <div className="font-semibold text-xs mb-2">
                    Порог достоверности: {confidenceTreshold}%
                </div>
                <div className="flex gap-2 items-center w-[320px]">
                    <span className="text-[10px]">0%</span>
                    <input
                        style={{ flex: "1 1 auto" }}
                        value={confidenceTreshold}
                        onChange={(v) => {
                            setConfidenceTreshold(Number(v.target.value));
                        }}
                        type="range"
                        id="confidence"
                        name="confidence"
                        min="0"
                        max="100"
                        step="1"
                    />
                    <span className="text-[10px]">100%</span>
                </div>
            </div>

            {hasPredictions && <div className="text-xs">{totalCountText}</div>}

            <div
                className={
                    props.imageSrc
                        ? containerClassName + " w-auto"
                        : containerClassName + " w-80 border-2"
                }
            >
                {hasPredictions && (
                    <ul>
                        {imagePredictions.map((prediction) => (
                            <li
                                key={prediction.detection_id}
                                className={
                                    "hover:border-red-400 hover:z-10 box-border absolute border-lime-400 border-solid border"
                                }
                                style={{ ...prediction.style }}
                            >
                                <label
                                    className={
                                        "absolute top-0 left-0 text-[10px] px-0.5 bg-lime-400"
                                    }
                                    style={{
                                        translate: "-1px -100%",
                                    }}
                                >
                                    {prediction.percent}%
                                </label>
                            </li>
                        ))}
                    </ul>
                )}

                {props.imageSrc ? (
                    <img
                        alt=""
                        className="h-[40rem] w-auto rounded-lg"
                        src={props.imageSrc}
                    />
                ) : (
                    <div className="text-xs absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-slate-50/80">
                        Тут будет ваше фото 🗾
                    </div>
                )}
                {imageQuery.isLoading && !imageQuery.isError && (
                    <div className="text-xs absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-slate-50/80">
                        Загрузка...
                    </div>
                )}
                {imageQuery.isError && (
                    <div className="text-red-600 text-xs absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-slate-50/80">
                        {imageQuery.error.message}
                    </div>
                )}
            </div>
        </>
    );
};
