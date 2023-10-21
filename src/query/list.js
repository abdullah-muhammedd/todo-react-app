import { useQuery, useQueryClient, useMutation, useInfiniteQuery, useQueries } from "@tanstack/react-query";
import { getLists, getListsCount, postList, patchList, deleteList } from '../client/lists'
export function fetchListsQueries(page) {
    const queries = useQueries({
        queries: [
            {
                queryKey: ["listsCount"],
                queryFn: async () => {
                    const response = await getListsCount();
                    if (response.error) {
                        throw response.error
                    }
                    return response.count;
                },
                staleTime: 5 * 60 * 1000
            },
            {
                queryKey: ["lists", page],
                queryFn: async () => {
                    const response = await getLists(page, 3);
                    if (response.error) {
                        throw response.error
                    }
                    return response.lists;
                },
                keepPreviousData: true,
                staleTime: 5 * 60 * 1000
            }]
    })
    return queries;
}

export function addListMutation(cb) {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (listData) => {
            const response = await postList(listData);
            return response
        },
        onSuccess: () => {
            // * Invalidate Caching
            queryClient.invalidateQueries(["lists"])
            queryClient.invalidateQueries(["listsCount"])
            cb();
        }
    });
    return mutation
}
export function updateListMutation(cb) {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (listData) => {
            const response = await patchList({ heading: listData.heading, color: listData.color }, listData._id);
            return response
        },
        onSuccess: () => {
            // * Invalidate Caching
            queryClient.invalidateQueries(["lists"])
            queryClient.invalidateQueries(["listsCount"])
            cb();
        }
    });
    return mutation
}

export function deleteListMutation(cb) {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (id) => {
            const response = await deleteList(id);
            return response
        },
        onSuccess: () => {
            // * Invalidate Caching
            queryClient.invalidateQueries(["lists"])
            queryClient.invalidateQueries(["listsCount"])
            cb();
        }
    });
    return mutation;
}