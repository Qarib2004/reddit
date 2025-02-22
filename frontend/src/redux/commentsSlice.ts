import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Comment } from "../interface/types";

export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include",
  }),
  tagTypes: ['Comments'],
  endpoints: (builder) => ({
    getComments: builder.query<Comment[], string>({
      query: (postId) => `/posts/${postId}/comments`,
      providesTags: (result, error, postId) => 
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Comments' as const, id: _id })),
              { type: 'Comments', id: postId },
            ]
          : [{ type: 'Comments', id: postId }],
    }),

    addComment: builder.mutation<Comment, { postId: string; content: string }>({
      query: ({ postId, content }) => ({
        url: `/posts/${postId}/comments`,
        method: "POST",
        body: { content, post: postId },
      }),
      async onQueryStarted({ postId }, { dispatch, queryFulfilled }) {
        try {
          const { data: newComment } = await queryFulfilled;
          dispatch(
            commentsApi.util.updateQueryData('getComments', postId, (draft) => {
              draft.push(newComment);
            })
          );
        } catch {}
      },
      invalidatesTags: (result, error, { postId }) => [{ type: 'Comments', id: postId }],
    }),

    likeComment: builder.mutation<{ message: string; upvotes: string[]; downvotes: string[]; karma: number }, string>({
      query: (id) => ({
        url: `/comments/${id}/upvotes`,
        method: "POST",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        try {
          const { data: updatedVotes } = await queryFulfilled;
          // Найти все активные запросы getComments
          const requests = commentsApi.util.selectInvalidatedBy(getState(), [{ type: 'Comments' }]);
          
          requests.forEach(({ originalArgs: postId }) => {
            if (typeof postId === 'string') {
              dispatch(
                commentsApi.util.updateQueryData('getComments', postId, (draft) => {
                  const updateCommentVotes = (comments: Comment[]) => {
                    for (let comment of comments) {
                      if (comment._id === id) {
                        comment.upvotes = updatedVotes.upvotes;
                        comment.downvotes = updatedVotes.downvotes;
                        comment.karma = updatedVotes.karma;
                        return;
                      }
                      if (comment.replies?.length) {
                        updateCommentVotes(comment.replies);
                      }
                    }
                  };
                  updateCommentVotes(draft);
                })
              );
            }
          });
        } catch {}
      },
    }),

    dislikeComment: builder.mutation<{ message: string; upvotes: string[]; downvotes: string[]; karma: number }, string>({
      query: (id) => ({
        url: `/comments/${id}/downvotes`,
        method: "POST",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        try {
          const { data: updatedVotes } = await queryFulfilled;
          const requests = commentsApi.util.selectInvalidatedBy(getState(), [{ type: 'Comments' }]);
          
          requests.forEach(({ originalArgs: postId }) => {
            if (typeof postId === 'string') {
              dispatch(
                commentsApi.util.updateQueryData('getComments', postId, (draft) => {
                  const updateCommentVotes = (comments: Comment[]) => {
                    for (let comment of comments) {
                      if (comment._id === id) {
                        comment.upvotes = updatedVotes.upvotes;
                        comment.downvotes = updatedVotes.downvotes;
                        comment.karma = updatedVotes.karma;
                        return;
                      }
                      if (comment.replies?.length) {
                        updateCommentVotes(comment.replies);
                      }
                    }
                  };
                  updateCommentVotes(draft);
                })
              );
            }
          });
        } catch {}
      },
    }),

    deleteComment: builder.mutation<{ message: string }, string>({
      query: (commentId) => ({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),
      async onQueryStarted(commentId, { dispatch, queryFulfilled, getState }) {
        try {
          await queryFulfilled;
          const requests = commentsApi.util.selectInvalidatedBy(getState(), [{ type: 'Comments' }]);
          
          requests.forEach(({ originalArgs: postId }) => {
            if (typeof postId === 'string') {
              dispatch(
                commentsApi.util.updateQueryData('getComments', postId, (draft) => {
                  const removeComment = (comments: Comment[]): boolean => {
                    const index = comments.findIndex(c => c._id === commentId);
                    if (index !== -1) {
                      comments.splice(index, 1);
                      return true;
                    }
                    for (let comment of comments) {
                      if (comment.replies?.length && removeComment(comment.replies)) {
                        return true;
                      }
                    }
                    return false;
                  };
                  removeComment(draft);
                })
              );
            }
          });
        } catch {}
      },
      invalidatesTags: ['Comments'],
    }),

    replyToComment: builder.mutation<Comment, { postId: string; parentId: string; content: string }>({
      query: ({ postId, parentId, content }) => ({
        url: `/comments/${parentId}/reply`,
        method: "POST",
        body: { content, postId, parentComment: parentId },
      }),
      async onQueryStarted({ postId, parentId }, { dispatch, queryFulfilled }) {
        try {
          const { data: newReply } = await queryFulfilled;
          dispatch(
            commentsApi.util.updateQueryData('getComments', postId, (draft) => {
              const addReply = (comments: Comment[]) => {
                for (let comment of comments) {
                  if (comment._id === parentId) {
                    comment.replies = comment.replies || [];
                    comment.replies.push(newReply);
                    return;
                  }
                  if (comment.replies?.length) {
                    addReply(comment.replies);
                  }
                }
              };
              addReply(draft);
            })
          );
        } catch {}
      },
      invalidatesTags: (result, error, { postId }) => [{ type: 'Comments', id: postId }],
    }),

    likeReply: builder.mutation<{ message: string; upvotes: string[]; downvotes: string[] }, string>({
      query: (id) => ({
        url: `/comments/${id}/reply/upvotes`,
        method: "POST",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        try {
          const { data: updatedVotes } = await queryFulfilled;
          const requests = commentsApi.util.selectInvalidatedBy(getState(), [{ type: 'Comments' }]);
          
          requests.forEach(({ originalArgs: postId }) => {
            if (typeof postId === 'string') {
              dispatch(
                commentsApi.util.updateQueryData('getComments', postId, (draft) => {
                  const updateReplyVotes = (comments: Comment[]) => {
                    for (let comment of comments) {
                      if (comment._id === id) {
                        comment.upvotes = updatedVotes.upvotes;
                        comment.downvotes = updatedVotes.downvotes;
                        return;
                      }
                      if (comment.replies?.length) {
                        updateReplyVotes(comment.replies);
                      }
                    }
                  };
                  updateReplyVotes(draft);
                })
              );
            }
          });
        } catch {}
      },
    }),

    dislikeReply: builder.mutation<{ message: string; upvotes: string[]; downvotes: string[] }, string>({
      query: (id) => ({
        url: `/comments/${id}/reply/downvotes`,
        method: "POST",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        try {
          const { data: updatedVotes } = await queryFulfilled;
          const requests = commentsApi.util.selectInvalidatedBy(getState(), [{ type: 'Comments' }]);
          
          requests.forEach(({ originalArgs: postId }) => {
            if (typeof postId === 'string') {
              dispatch(
                commentsApi.util.updateQueryData('getComments', postId, (draft) => {
                  const updateReplyVotes = (comments: Comment[]) => {
                    for (let comment of comments) {
                      if (comment._id === id) {
                        comment.upvotes = updatedVotes.upvotes;
                        comment.downvotes = updatedVotes.downvotes;
                        return;
                      }
                      if (comment.replies?.length) {
                        updateReplyVotes(comment.replies);
                      }
                    }
                  };
                  updateReplyVotes(draft);
                })
              );
            }
          });
        } catch {}
      },
    }),

    reportComment: builder.mutation<{ message: string }, { commentId: string; reason: string }>({
      query: ({ commentId, reason }) => ({
        url: `comments/report/${commentId}`,
        method: "POST",
        body: { reason },
      }),
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
  useDislikeCommentMutation,
  useReplyToCommentMutation,
  useLikeReplyMutation,
  useDislikeReplyMutation,
  useReportCommentMutation
} = commentsApi;