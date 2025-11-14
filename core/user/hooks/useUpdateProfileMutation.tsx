import { useMutation } from '@tanstack/react-query';

import { ServerException } from '@/core/interfaces/server-exception.response';
import { AxiosError } from 'axios';
import Toast from 'react-native-toast-message';
import { updateProfileAction } from '../actions/update-profile.action';
import { UpdateProfileResponse } from '../interfaces/update-profile.interface';
import { UpdateProfileRequest } from '../schemas/update-profile.schema';

export const useUpdateProfileMutation = () => {
  return useMutation<
    UpdateProfileResponse,
    AxiosError<ServerException>,
    UpdateProfileRequest
  >({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await updateProfileAction(data);
      return response;
    },
    onSuccess: (response) => {
      Toast.show({
        type: 'error',
        text1: 'Profile update failed',
        text2: response.message,
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Profile update failed',
        text2:
          error.response?.data.message ||
          error.message ||
          'An error occurred while updating the profile.',
      });
    },
  });
};
