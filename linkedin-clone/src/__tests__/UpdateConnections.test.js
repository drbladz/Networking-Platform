import { render, screen, fireEvent } from '@testing-library/react';
import UpdateConnections from '../components/UpdateConnections';

describe('UpdateConnections', () => {
  it('should render "Connections" header', () => {
    render(<UpdateConnections />);
    const headerElement = screen.getByText('Connections');
    expect(headerElement).toBeInTheDocument();
  });

  it('should render connections list', () => {
    render(<UpdateConnections />);
    const connectionItems = screen.getAllByRole('listitem');
    expect(connectionItems.length).toBe(2);
  });

  /*it('should delete a connection when delete button is clicked', () => {
    render(<UpdateConnections />);
    const deleteButton = screen.getByRole('button',  { name: /delete/i });
    fireEvent.click(deleteButton);
    const connectionItems = screen.getAllByRole('listitem');
    expect(connectionItems.length).toBe(1);
  });*/
});