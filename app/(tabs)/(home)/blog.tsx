import React, { useState } from 'react';
import { View, ScrollView, Linking } from 'react-native';
import { DateTime } from 'luxon';
import { useQuery } from '@tanstack/react-query';

import Loader from '@/presentation/theme/components/Loader';
import Alert from '@/presentation/theme/components/ui/Alert';
import SimpleCard from '@/presentation/theme/components/ui/SimpleCard/SimpleCard';

import { getPosts } from '@/core/posts/actions/get-posts';
import { PostResponse } from '@/core/posts/interfaces/postResponse';

const Blog = () => {
  const [htmlContent, setHtmlContent] = useState(null);

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(),
  });

  if (isPending) {
    return <Loader />;
  }

  if (!htmlContent) {
    return (
      <ScrollView>
        <View style={{ padding: 20, gap: 20 }}>
          {data &&
            data?.map((post: PostResponse) => (
              <SimpleCard
                key={post.id}
                icon="link-outline"
                title={`${post.title} `}
                subtitle={`By: ${post.user.name} ${
                  post.user.lastName
                } \n${DateTime.fromISO(post.createdAt).toRelative()}`}
                titleLink={post.url}
              />
            ))}
          {!isSuccess && (
            <Alert variant="error">The content could not be loaded</Alert>
          )}
        </View>
      </ScrollView>
    );
  }
};

export default Blog;
