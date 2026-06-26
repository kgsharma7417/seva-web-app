# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateBooking, useCreateReview, useListProvidersByCategory, useGetUserBookings } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateBooking(createBookingVars);

const { data, isPending, isSuccess, isError, error } = useCreateReview(createReviewVars);

const { data, isPending, isSuccess, isError, error } = useListProvidersByCategory(listProvidersByCategoryVars);

const { data, isPending, isSuccess, isError, error } = useGetUserBookings();

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createBooking, createReview, listProvidersByCategory, getUserBookings } from '@dataconnect/generated';


// Operation CreateBooking:  For variables, look at type CreateBookingVars in ../index.d.ts
const { data } = await CreateBooking(dataConnect, createBookingVars);

// Operation CreateReview:  For variables, look at type CreateReviewVars in ../index.d.ts
const { data } = await CreateReview(dataConnect, createReviewVars);

// Operation ListProvidersByCategory:  For variables, look at type ListProvidersByCategoryVars in ../index.d.ts
const { data } = await ListProvidersByCategory(dataConnect, listProvidersByCategoryVars);

// Operation GetUserBookings: 
const { data } = await GetUserBookings(dataConnect);


```