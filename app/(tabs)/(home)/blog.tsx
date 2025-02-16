import React, { useState } from 'react';
import { View, ScrollView, Linking, FlatList } from 'react-native';
import { DateTime } from 'luxon';
import { useQuery } from '@tanstack/react-query';

import Loader from '@/presentation/theme/components/Loader';
import Alert from '@/presentation/theme/components/ui/Alert';
import SimpleCard from '@/presentation/theme/components/ui/SimpleCard/SimpleCard';

import { getPosts } from '@/core/posts/actions/get-posts';
import ExpenseEmptyList from '@/presentation/theme/components/EmptyList';
import EmptyList from '@/presentation/theme/components/EmptyList';
import ExpenseCard from '@/presentation/theme/components/receipts/expenses/ExpenseCard';

const BlogScreen = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(),
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <FlatList
      style={{ paddingHorizontal: 20, paddingTop: 20 }}
      data={data ?? []}
      numColumns={1}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <SimpleCard
          icon="link-outline"
          title={item.title}
          subtitle={`By: ${item.user.name} ${
            item.user.lastName
          } \n${DateTime.fromISO(item.createdAt).toRelative()}`}
          titleLink={item.url}
          style={{ marginBottom: 10 }}
        />
      )}
      // onEndReached={loadNextPage}
      onEndReachedThreshold={0.8}
      showsVerticalScrollIndicator={false}
      // refreshControl={
      //   <RefreshControl
      //     refreshing={isRefreshing}
      //     onRefresh={onPullToRefresh}
      //   />
      // }
      ListEmptyComponent={<EmptyList title="No entries found." />}
    />
    // <ScrollView>
    //   <View style={{ padding: 20, gap: 20 }}>
    //     {data &&
    //       data?.map((post: PostResponse) => (
    //         <SimpleCard
    //           key={post.id}
    //           icon="link-outline"
    //           title={`${post.title} `}
    //           subtitle={`By: ${post.user.name} ${
    //             post.user.lastName
    //           } \n${DateTime.fromISO(post.createdAt).toRelative()}`}
    //           titleLink={post.url}
    //         />
    //       ))}
    //     {!isSuccess && (
    //       <Alert variant="error">The content could not be loaded</Alert>
    //     )}
    //   </View>
    // </ScrollView>
  );
};

export default BlogScreen;
