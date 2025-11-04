import api from "./api";

export const postPasswordFeature = async (featureData) => {
    const response = await api.post("/post/password-feature", featureData);
    return response.data;
}
