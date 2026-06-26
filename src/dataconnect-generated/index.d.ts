import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Booking_Key {
  id: UUIDString;
  __typename?: 'Booking_Key';
}

export interface CreateBookingData {
  booking_insert: Booking_Key;
}

export interface CreateBookingVariables {
  scheduledDate: TimestampString;
  totalCost: number;
  userId: UUIDString;
  providerId: UUIDString;
}

export interface CreateReviewData {
  review_insert: Review_Key;
}

export interface CreateReviewVariables {
  rating: number;
  comment: string;
  bookingId: UUIDString;
  userId: UUIDString;
}

export interface GetUserBookingsData {
  bookings: ({
    id: UUIDString;
    status: string;
    scheduledDate: TimestampString;
    totalCost: number;
    provider: {
      name: string;
    };
  } & Booking_Key)[];
}

export interface ListProvidersByCategoryData {
  providers: ({
    id: UUIDString;
    name: string;
    rating: number;
    hourlyRate?: number | null;
    services_on_provider: ({
      title: string;
      basePrice: number;
    })[];
  } & Provider_Key)[];
}

export interface ListProvidersByCategoryVariables {
  category: string;
}

export interface Provider_Key {
  id: UUIDString;
  __typename?: 'Provider_Key';
}

export interface Review_Key {
  id: UUIDString;
  __typename?: 'Review_Key';
}

export interface Service_Key {
  id: UUIDString;
  __typename?: 'Service_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateBookingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
  operationName: string;
}
export const createBookingRef: CreateBookingRef;

export function createBooking(vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;
export function createBooking(dc: DataConnect, vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;

interface CreateReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
  operationName: string;
}
export const createReviewRef: CreateReviewRef;

export function createReview(vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;
export function createReview(dc: DataConnect, vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;

interface ListProvidersByCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListProvidersByCategoryVariables): QueryRef<ListProvidersByCategoryData, ListProvidersByCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListProvidersByCategoryVariables): QueryRef<ListProvidersByCategoryData, ListProvidersByCategoryVariables>;
  operationName: string;
}
export const listProvidersByCategoryRef: ListProvidersByCategoryRef;

export function listProvidersByCategory(vars: ListProvidersByCategoryVariables, options?: ExecuteQueryOptions): QueryPromise<ListProvidersByCategoryData, ListProvidersByCategoryVariables>;
export function listProvidersByCategory(dc: DataConnect, vars: ListProvidersByCategoryVariables, options?: ExecuteQueryOptions): QueryPromise<ListProvidersByCategoryData, ListProvidersByCategoryVariables>;

interface GetUserBookingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserBookingsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserBookingsData, undefined>;
  operationName: string;
}
export const getUserBookingsRef: GetUserBookingsRef;

export function getUserBookings(options?: ExecuteQueryOptions): QueryPromise<GetUserBookingsData, undefined>;
export function getUserBookings(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserBookingsData, undefined>;

