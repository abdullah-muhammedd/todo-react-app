import { useQuery, useQueryClient, useMutation, useInfiniteQuery, useQueries } from "@tanstack/react-query";
import { getTags, getTagsCount, postTag, patchTag, deleteTag } from '../client/tags'
export function fetchTagsQueries(page) {
    const queries = useQueries({
        queries: [
            {
                queryKey: ["tagsCount"],
                queryFn: async () => {
                    const response = await getTagsCount();
                    if (response.error) {
                        throw response.error
                    }
                    return response.count;
                },
                staleTime: 5 * 60 * 1000
            },
            {
                queryKey: ["tags", page],
                queryFn: async () => {
                    const response = await getTags(page, 3);
                    if (response.error) {
                        throw response.error
                    }
                    return response.tags;
                },
                keepPreviousData: true,
                staleTime: 5 * 60 * 1000
            }]
    })
    return queries;
}

export function addTagMutation(cb) {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (tagData) => {
            const response = await postTag(tagData);
            return response
        },
        onSuccess: () => {
            // * Invalidate Caching
            queryClient.invalidateQueries(["tags"])
            queryClient.invalidateQueries(["tagsCount"])
            cb();
        }
    });
    return mutation
}
export function updateTagMutation(cb) {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (tagData) => {
            const response = await patchTag({ heading: tagData.heading, color: tagData.color }, tagData._id);
            return response
        },
        onSuccess: () => {
            // * Invalidate Caching
            queryClient.invalidateQueries(["tags"])
            queryClient.invalidateQueries(["tagsCount"])
            cb();
        }
    });
    return mutation
}

export function deleteTagMutation(cb) {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (id) => {
            const response = await deleteTag(id);
            return response
        },
        onSuccess: () => {
            // * Invalidate Caching
            queryClient.invalidateQueries(["tags"])
            queryClient.invalidateQueries(["tagsCount"])
            cb();
        }
    });
    return mutation;
}