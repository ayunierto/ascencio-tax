import React, { useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FlatList, Image, RefreshControl, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PostCard } from '@/components/posts/PostCard';
import { PostListSkeleton } from '@/components/posts/PostCardSkeleton';
import { theme } from '@/components/ui/theme';
import { ThemedText } from '@/components/ui/ThemedText';
import { EmptyContent } from '@/core/components';
import { ServerException } from '@/core/interfaces/server-exception.response';
import { getPostsAction } from '@/core/posts/actions/get-posts';
import { Post } from '@/core/posts/interfaces';

const BlogScreen = () => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter posts based on search query
  const filteredPosts = posts?.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isError) {
    return (
      <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: theme.background }}>
        <EmptyContent
          title="Something went wrong."
          subtitle={error.response?.data.message || error.message}
          icon="sad-outline"
          onRetry={refetch}
        />
      </View>
    );
  }

  if (isLoading) {
    return <PostListSkeleton />;
  }

  if (!posts || posts.length === 0) {
    return (
      <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: theme.background }}>
        <EmptyContent
          title="No posts available."
          subtitle="Please check back later."
          icon="information-circle-outline"
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: theme.background }}>
      <FlatList
        data={filteredPosts}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
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

            {/* Search Bar */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.card,
                borderRadius: theme.radius,
                borderWidth: 1,
                borderColor: theme.border,
                paddingHorizontal: 12,
                marginBottom: 20,
                height: 48,
              }}
            >
              <Ionicons
                name="search-outline"
                size={20}
                color={theme.mutedForeground}
              />
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: 8,
                  fontSize: 16,
                  color: theme.foreground,
                }}
                placeholder="Search articles..."
                placeholderTextColor={theme.mutedForeground}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={theme.mutedForeground}
                  onPress={() => setSearchQuery('')}
                />
              )}
            </View>

            {/* Results count */}
            <ThemedText
              style={{
                fontSize: 14,
                color: theme.mutedForeground,
                marginBottom: 12,
              }}
            >
              {filteredPosts?.length || 0}{' '}
              {filteredPosts?.length === 1 ? 'article' : 'articles'} available
            </ThemedText>
          </>
        }
        ListEmptyComponent={
          <EmptyContent
            title="No articles found"
            subtitle="Try adjusting your search"
            icon="search-outline"
          />
        }
        contentContainerStyle={{
          padding: 10,
          paddingBottom: 40,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      />
    </View>
  );
};

export default BlogScreen;
