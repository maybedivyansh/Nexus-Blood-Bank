import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bloodType = searchParams.get('blood_type');
  const radius = searchParams.get('radius');

  if (!bloodType) {
    return NextResponse.json({ error: 'blood_type is required' }, { status: 400 });
  }

  // Mocking database retrieval: usually we'd use Prisma to query `User` and `Inventory`
  // and compute distance if users have lat/lng.
  const mockInventories = [
    {
      id: "INV-1234",
      bankName: "City Central Blood Bank",
      bloodType: bloodType,
      units: 15,
      distance: 2.4, // Mock distance in km
      location: { lat: 40.71, lng: -74.01 }
    },
    {
      id: "INV-1235",
      bankName: "St. Jude Hospital",
      bloodType: bloodType,
      units: 3,
      distance: 5.1,
      location: { lat: 40.75, lng: -73.98 }
    }
  ];

  // Proximity sorting logic
  const sortedInventories = mockInventories.sort((a, b) => a.distance - b.distance);

  return NextResponse.json({
    status: 'success',
    data: sortedInventories,
  });
}
