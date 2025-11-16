# Ascencio Tax App - AI Coding Assistant Instructions

## Project Overview

React Native mobile app for tax services built with Expo Router (v6+) and file-based routing. Features authentication, booking system, blog, expense tracking with receipt scanning.

**Tech Stack:** React Native 0.81, Expo SDK 54, TypeScript, Expo Router, React Query, Zustand, Zod, React Hook Form

## Code Quality Standards

**Always follow:**
- **Clean Code principles** - Write readable, self-documenting code with meaningful names
- **SOLID principles** - Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **Design Patterns** - Use established patterns (Repository for data access, Observer via React Query, Strategy for business logic)

## Architecture Patterns

### Directory Structure Philosophy

```
core/                    # Feature modules (auth, booking, accounting, etc.)
  {feature}/
    actions/            # API calls returning Promises
    hooks/              # React Query wrappers & form logic
    interfaces/         # TypeScript type definitions
    schemas/            # Zod validation schemas
    store/              # Zustand stores (if needed)
    components/         # Feature-specific components
app/                    # Expo Router file-based routing
components/             # Shared UI components
```

### State Management Layers

1. **Server State:** React Query (`@tanstack/react-query`) - All API data
2. **Global Client State:** Zustand - Auth status, user data
3. **Local Form State:** React Hook Form + Zod validation
4. **Navigation State:** Expo Router built-in

### Core Architecture Pattern

**Action → Hook → Component flow:**

```typescript
// 1. Action: Pure API call (core/{feature}/actions/)
export const signInAction = async (credentials: SignInRequest): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/signin', credentials);
  return data;
};

// 2. Hook: Combines mutation + form logic (core/{feature}/hooks/)
export const useSignIn = () => {
  const { mutate, isPending } = useSignInMutation();
  const { control, handleSubmit, formState: { errors } } = useForm<SignInRequest>({
    resolver: zodResolver(signInSchema),
  });

  const handleSignIn = (values: SignInRequest) => {
    mutate(values, {
      onSuccess: () => Toast.show({ type: 'success', text1: 'Sign in successful' }),
      onError: (error) => Toast.show({ type: 'error', text1: error.message }),
    });
  };

  return { control, handleSubmit, errors, isPending, handleSignIn };
};

// 3. Component: Uses hook, minimal logic
const SignInScreen = () => {
  const { control, handleSubmit, formErrors, isPending, handleSignIn } = useSignIn();
  // Render form with Controller components
};
```

## Critical Development Patterns

### API Integration

- **Base client:** `core/api/api.ts` (axios with auto-injected Bearer token from `expo-secure-store`)
- **Environment vars:** Use `process.env.EXPO_PUBLIC_*` (see `.env.example`)
- **Auth flow:** Token stored via `StorageAdapter` wrapper around `expo-secure-store`

```typescript
// core/adapters/storage.adapter.ts wraps expo-secure-store
await StorageAdapter.setItem('access_token', token);
const token = await StorageAdapter.getItem('access_token');
```

### Form Validation Pattern

Always use React Hook Form + Zod:

```typescript
// 1. Define schema (core/{feature}/schemas/)
export const signInSchema = z.object({
  email: z.string().email({ message: 'Email must be a valid email.' }),
  password: z.string().min(6),
});
export type SignInRequest = z.infer<typeof signInSchema>;

// 2. Use in hook with zodResolver
const { control, handleSubmit, formState: { errors } } = useForm<SignInRequest>({
  resolver: zodResolver(signInSchema),
});

// 3. Render with Controller
<Controller
  control={control}
  name="email"
  render={({ field: { onChange, onBlur, value } }) => (
    <Input
      value={value}
      onBlur={onBlur}
      onChangeText={onChange}
      error={!!errors.email}
      errorMessage={errors.email?.message}
    />
  )}
/>
```

### React Query Patterns

**Queries (GET operations):**
```typescript
export const useServices = () => {
  return useQuery<Service[], AxiosError<ServerException>>({
    queryKey: ['services'],
    queryFn: getServicesAction,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
```

**Infinite Queries (pagination):**
```typescript
useInfiniteQuery({
  queryKey: ['expenses', 'infinite'],
  queryFn: ({ pageParam }) => getExpenses(10, pageParam * 10),
  initialPageParam: 0,
  getNextPageParam: (lastPage, allPages) => allPages.length,
});
```

**Mutations (POST/PUT/DELETE):**
```typescript
export const useExpenseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ExpenseResponse, AxiosError<ServerException>, ExpenseFormFields>({
    mutationFn: createUpdateExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', 'infinite'] });
    },
  });
};
```

### Routing & Navigation

**File-based routing:** `app/(tabs)/{feature}/{screen}.tsx`

**Navigation:** Use `expo-router` hooks:
```typescript
import { router } from 'expo-router';
router.push('/(tabs)/auth/sign-in');
router.replace('/(tabs)/(home)'); // No back
router.dismiss(); // Close modal
```

**Auth-gated routes:** Check `authStatus` in tab configuration (see `app/(tabs)/_layout.tsx`)
```typescript
<Tabs.Screen
  name="settings"
  options={{
    href: authStatus === 'authenticated' ? '/settings' : null,
  }}
/>
```

### UI Component System

**Custom component library:** `components/ui/` - Button, Input, Card, Select, etc.

**Theme:** `components/ui/theme.ts` - Centralized colors/spacing. Import as `import { theme } from '@/components/ui/theme';`

**Icons:** Use `@expo/vector-icons` Ionicons:
```typescript
<Ionicons name="person-outline" size={28} color={theme.primary} />
```

**Feedback:** Use `react-native-toast-message` for all user feedback:
```typescript
Toast.show({
  type: 'success', // 'success' | 'error' | 'info'
  text1: 'Operation successful',
  text2: 'Additional details',
});
```

### TypeScript Conventions

- **Interfaces:** `{Feature}Response`, `{Feature}Request` (in `interfaces/` dir)
- **Schemas:** `{feature}Schema`, `{Feature}Request` type from zod (in `schemas/` dir)
- **Actions:** `{verb}{Feature}Action` (e.g., `signInAction`, `getExpensesAction`)
- **Hooks:** `use{Feature}` or `use{Feature}Mutation`

### Common Pitfalls

1. **Never bypass Zustand stores for auth** - Use `useAuthStore` for user/token state
2. **Always invalidate queries** after mutations - Prevents stale data
3. **Use absolute imports** - `@/` alias configured in `tsconfig.json`
4. **Toast for feedback** - Don't use native Alert for success/error messages
5. **Safe area insets** - Wrap layouts with `useSafeAreaInsets()` from `react-native-safe-area-context`

## Development Workflow

**Start dev server:**
```bash
npm start
# or specific platform
npm run android
npm run ios
npm run web
```

**Linting:**
```bash
npm run lint
```

**Key files to reference:**
- `core/auth/store/useAuthStore.ts` - Auth state management pattern
- `core/auth/hooks/useSignin.tsx` - Form + mutation hook pattern
- `app/(tabs)/_layout.tsx` - Tab navigation with auth guards
- `components/ui/Input.tsx` - Custom animated input component
- `core/api/api.ts` - Axios client with interceptors

## Feature-Specific Notes

**Camera/Receipt Scanning:** Uses `expo-camera` + `expo-image-picker`. Camera permissions handled in `core/camera/index.tsx`. Selected images stored in Zustand (`useCameraStore`).

**Booking System:** Calendar integration with `react-native-calendars`. Availability fetched from `/schedules/availability` endpoint.

**Accounting:** Expense tracking with receipt OCR. Images uploaded to `/expenses/upload-receipt-image` endpoint before form submission.
