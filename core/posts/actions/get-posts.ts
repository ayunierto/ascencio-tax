export const getPosts = async () => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/posts`);

    const posts = await response.json();

    return posts;
  } catch (error) {
    console.error(error);
    return null;
  }
};
