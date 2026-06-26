import { CreateBookingData, CreateBookingVariables, CreateReviewData, CreateReviewVariables, ListProvidersByCategoryData, ListProvidersByCategoryVariables, GetUserBookingsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateBooking(options?: useDataConnectMutationOptions<CreateBookingData, FirebaseError, CreateBookingVariables>): UseDataConnectMutationResult<CreateBookingData, CreateBookingVariables>;
export function useCreateBooking(dc: DataConnect, options?: useDataConnectMutationOptions<CreateBookingData, FirebaseError, CreateBookingVariables>): UseDataConnectMutationResult<CreateBookingData, CreateBookingVariables>;

export function useCreateReview(options?: useDataConnectMutationOptions<CreateReviewData, FirebaseError, CreateReviewVariables>): UseDataConnectMutationResult<CreateReviewData, CreateReviewVariables>;
export function useCreateReview(dc: DataConnect, options?: useDataConnectMutationOptions<CreateReviewData, FirebaseError, CreateReviewVariables>): UseDataConnectMutationResult<CreateReviewData, CreateReviewVariables>;

export function useListProvidersByCategory(vars: ListProvidersByCategoryVariables, options?: useDataConnectQueryOptions<ListProvidersByCategoryData>): UseDataConnectQueryResult<ListProvidersByCategoryData, ListProvidersByCategoryVariables>;
export function useListProvidersByCategory(dc: DataConnect, vars: ListProvidersByCategoryVariables, options?: useDataConnectQueryOptions<ListProvidersByCategoryData>): UseDataConnectQueryResult<ListProvidersByCategoryData, ListProvidersByCategoryVariables>;

export function useGetUserBookings(options?: useDataConnectQueryOptions<GetUserBookingsData>): UseDataConnectQueryResult<GetUserBookingsData, undefined>;
export function useGetUserBookings(dc: DataConnect, options?: useDataConnectQueryOptions<GetUserBookingsData>): UseDataConnectQueryResult<GetUserBookingsData, undefined>;
