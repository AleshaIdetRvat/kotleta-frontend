export const fileToDataUrl = (file: File | Blob): Promise<string | null> => {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string | null)
        reader.readAsDataURL(file)
    })
}
