import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Image, RefreshControl, ScrollView, View } from 'react-native';

import Loader from '@/components/Loader';
import { PostCard } from '@/components/posts/PostCard';
import { theme } from '@/components/ui/theme';
import { ThemedText } from '@/components/ui/ThemedText';
import { EmptyContent } from '@/core/components';
import { ServerException } from '@/core/interfaces/server-exception.response';
import { getPostsAction } from '@/core/posts/actions/get-posts';
import { Post } from '@/core/posts/interfaces';

const BlogScreen = () => {
  const {
    data: posts,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<Post[], AxiosError<ServerException>, Post[]>({
    queryKey: ['posts'],
    queryFn: getPostsAction,
  });

  if (isError) {
    return (
      <EmptyContent
        title="Something went wrong."
        subtitle={error.response?.data.message || error.message}
        icon="sad-outline"
      />
    );
  }
  if (isLoading) {
    return <Loader message="Loading posts..." />;
  }
  if (!posts || posts.length === 0) {
    return (
      <EmptyContent
        title="No posts available."
        subtitle="Please check back later."
        icon="information-circle-outline"
      />
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={theme.primary}
          colors={[theme.primary]}
        />
      }
    >
      <View style={{ padding: 20 }}>
        {/* Logo - Scrolleable */}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
            marginTop: 10,
          }}
        >
          <Image
            source={require('@/assets/images/logo.png')}
            style={{
              width: '70%',
              maxWidth: 250,
              resizeMode: 'contain',
              height: 120,
            }}
          />
        </View>

        {/* Header */}
        <View style={{ marginBottom: 20 }}>
          <ThemedText style={{ fontSize: 24, fontWeight: 'bold' }}>
            Latest Articles
          </ThemedText>
          <ThemedText style={{ fontSize: 14, color: theme.mutedForeground }}>
            Stay updated with tax tips and news
          </ThemedText>
        </View>

        {/* Posts */}
        <View style={{ flexDirection: 'column', gap: 10 }}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default BlogScreen;
