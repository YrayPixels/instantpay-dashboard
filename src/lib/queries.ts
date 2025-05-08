import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export interface NewsEventsType {
    title: string,
    preview_image: string,
    video_url: string,
    caption: string,
    content: string,
}

export const queries = {
    // Get User by ID
    getUserById: async (id) => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Create a new User
    createUser: async (email, password, role, chapter_id = null) => {
        const { data, error } = await supabase
            .from('users')
            .insert({ email, password, role, chapter_id })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get all News and Events
    getAllNewsEvents: async () => {
        const { data, error } = await supabase
            .from('news_events')
            .select('*');

        if (error) throw error;
        return data;
    },

  

  // Create News Event
    createNewsEvent: async ({title, preview_image, video_url, caption, content}:NewsEventsType) => {
        const { data, error } = await supabase
            .from('news_events')
            .insert({ title, preview_image, video_url, caption, content })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Add Comment to News Event
    addNewsComment: async (news_id, user_id, comment) => {
        const { data, error } = await supabase
            .from('news_comments')
            .insert({ news_id, user_id, comment })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Like a News Event
    likeNewsEvent: async (news_id, user_id) => {
        const { data, error } = await supabase
            .from('news_likes')
            .insert({ news_id, user_id })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get All Chapters
    getAllChapters: async () => {
        const { data, error } = await supabase
            .from('chapters')
            .select('*');

        if (error) throw error;
        return data;
    },

    // Create a Chapter Activity
    createChapterActivity: async (chapter_id, title, description, image_url) => {
        const { data, error } = await supabase
            .from('chapter_activities')
            .insert({ chapter_id, title, description, image_url })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get Gallery Images
    getGalleryImages: async () => {
        const { data, error } = await supabase
            .from('gallery')
            .select('*');

        if (error) throw error;
        return data;
    },

    // Get Homepage Carousel Images
    getCarouselImages: async () => {
        const { data, error } = await supabase
            .from('carousel_images')
            .select('*');

        if (error) throw error;
        return data;
    },

    // Get President Remarks
    getPresidentRemarks: async () => {
        const { data, error } = await supabase
            .from('president_remarks')
            .select('*');

        if (error) throw error;
        return data;
    },

    // Get Set Activities
    getSetActivities: async (set_id) => {
        const { data, error } = await supabase
            .from('set_activities')
            .select('*')
            .eq('set_id', set_id);

        if (error) throw error;
        return data;
    },

    // Delete a News Event
    deleteNewsEvent: async (id) => {
        const { error } = await supabase
            .from('news_events')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    // Update a Chapter Activity
    updateChapterActivity: async (id, title, description, image_url) => {
        const { data, error } = await supabase
            .from('chapter_activities')
            .update({ title, description, image_url })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
