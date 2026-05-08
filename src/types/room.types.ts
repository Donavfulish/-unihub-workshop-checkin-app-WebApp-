export interface RoomResponse {
  id: number;
  name?: string | null;
  capacity?: number | null;
  map_url?: string | null;
}

export interface RoomsListResponse {
  rooms: RoomResponse[];
  total: number;
}
