import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DmModal from '../components/DmModal';

describe('DmModal', () => {
  test('renders chat window', () => {
    const { getByText, getByPlaceholderText } = render(<DmModal currentUserId="123" recipientId="456" />);
    expect(getByText('Loading...')).toBeInTheDocument();
    expect(getByPlaceholderText('Type your message')).toBeInTheDocument();
  });

  test.only('sends a message', async () => {
    const { getByText, getByPlaceholderText } = render(<DmModal currentUserId="123" recipientId="456" />);
    const input = getByPlaceholderText('Type your message');
    fireEvent.change(input, { target: { value: 'Hello World!' } });
    expect(input.value).toBe('Hello World!');
    const icon = getByText("Send");
    fireEvent.click(icon);
    expect(input.value).toBe('Hello World!');
  });
});
