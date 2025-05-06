interface Grievance {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'resolved';
  createdAt: string;
  userId: string;
  upvotes: number;
  comments: number;
}

type GrievanceStatus = 'all' | 'pending' | 'resolved';

// This is a mock implementation for now
// In a real app, this would make an API call to fetch actual data
export const fetchGrievances = async (status: GrievanceStatus = 'all'): Promise<Grievance[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock data
  const mockGrievances: Grievance[] = [
    {
      id: '1',
      title: 'Classroom Projector Not Working',
      description: 'The projector in Room 101 has been flickering and sometimes shutting off during lectures. This is disrupting classes.',
      status: 'pending',
      createdAt: '2023-09-15T10:30:00Z',
      userId: 'student1',
      upvotes: 15,
      comments: 3
    },
    {
      id: '2',
      title: 'Library Hours Extension Request',
      description: 'Many students have requested extended library hours during exam weeks to accommodate study groups.',
      status: 'resolved',
      createdAt: '2023-09-10T14:20:00Z',
      userId: 'student2',
      upvotes: 42,
      comments: 7
    },
    {
      id: '3',
      title: 'Cafeteria Food Quality Concerns',
      description: 'Several students have reported concerns about the quality and variety of food options available in the main cafeteria.',
      status: 'pending',
      createdAt: '2023-09-12T09:15:00Z',
      userId: 'student3',
      upvotes: 28,
      comments: 12
    },
    {
      id: '4',
      title: 'Wi-Fi Connectivity Issues in Dorms',
      description: 'Students in the east wing dormitories are experiencing frequent Wi-Fi disconnections, affecting their ability to complete online assignments.',
      status: 'pending',
      createdAt: '2023-09-14T16:45:00Z',
      userId: 'student4',
      upvotes: 35,
      comments: 8
    },
    {
      id: '5',
      title: 'Request for Additional Study Spaces',
      description: 'With increasing enrollment, the current study spaces are often overcrowded. Students are requesting additional dedicated study areas.',
      status: 'resolved',
      createdAt: '2023-09-08T11:30:00Z',
      userId: 'student5',
      upvotes: 20,
      comments: 5
    }
  ];
  
  // Filter based on status if not 'all'
  if (status !== 'all') {
    return mockGrievances.filter(grievance => grievance.status === status);
  }
  
  return mockGrievances;
};