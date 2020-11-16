const buildFormData = (formData, data, parentKey) => {
    if (
        data &&
        typeof data === 'object' &&
        !(data instanceof Date) &&
        !(data instanceof File) &&
        !(Array.isArray(data) && !data.length)
    )
        Object.keys(data).forEach(key => {
            buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key)
        })
    else if (data !== null && data !== undefined) formData.append(parentKey, data)
}

export const objToFormData = obj => {
    const formData = new FormData()

    buildFormData(formData, obj)

    return formData
}