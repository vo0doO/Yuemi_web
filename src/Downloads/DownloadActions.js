export const addDownload = (id, bundle) => {
    return {
        type: "ADD_DOWNLOAD",
        id,
        bundle
    }
}

export const removeDownload = (id) => {
    return {
        type: "REMOVE_DOWNLOAD",
        id
    }
}

export const setProgress = (id, progress) => {
    return {
        type: "SET_PROGRESS",
        id,
        progress
    }
}

export const setActive = (id) => {
    return {
        type: "SET_ACTIVE",
        id
    }
}
