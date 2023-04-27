import { render, screen } from '@testing-library/react';
import { GroupJobPostings } from '../components/GroupJobPostings';

describe('GroupJobPostings component', () => {
  const fakeJobPostings = [
    {
      id: '1',
      postTitle: 'Fake Job Posting 1',
      displayName: 'Fake Display Name 1',
      timeStamp: new Date('2022-04-20T12:00:00.000Z'),
      photoURL: 'fake-photo-url-1',
      postDescription: 'Fake job posting description 1',
      isExternal: true,
      groupId: 'fake-group-id',
    },
    {
      id: '2',
      postTitle: 'Fake Job Posting 2',
      displayName: 'Fake Display Name 2',
      timeStamp: new Date('2022-04-21T12:00:00.000Z'),
      photoURL: 'fake-photo-url-2',
      postDescription: 'Fake job posting description 2',
      isExternal: false,
      groupId: 'fake-group-id',
    },
  ];

  const mockConnect = jest.fn();
  jest.mock('react-redux', () => ({
    connect: () => (component) => component,
  }));

  test('renders job postings correctly', () => {
    render(<GroupJobPostings jobPostings={fakeJobPostings} />);
    expect(screen.getByText('Fake Job Posting 1')).toBeInTheDocument();
    expect(screen.getByText('Fake Display Name 1')).toBeInTheDocument();
    expect(screen.getByText('4/20/2022, 12:00:00 PM')).toBeInTheDocument();
    expect(screen.getByText('Fake job posting description 1')).toBeInTheDocument();
    expect(screen.getByText('Apply!')).toBeInTheDocument();

    expect(screen.getByText('Fake Job Posting 2')).toBeInTheDocument();
    expect(screen.getByText('Fake Display Name 2')).toBeInTheDocument();
    expect(screen.getByText('4/21/2022, 12:00:00 PM')).toBeInTheDocument();
    expect(screen.getByText('Fake job posting description 2')).toBeInTheDocument();
    expect(screen.getByText('Apply!')).toBeInTheDocument();
  });
});
