import { render, screen, fireEvent } from '@testing-library/react';
import UpdateConnections from '../components/UpdateConnections';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme'
import { BrowserRouter } from 'react-router-dom';
jest.mock('react-redux', () => ({
  connect: () => (ReactComponent) => ReactComponent,
}));

const props = {
  "userId": "dypmxIlR8yTGpB4DzuNXwe21DrA3",
  "user": {
    "contactInfo": "",
    "connections": [
      {
        "photoURL": "",
        "id": "tC3NGOXjIEZLjcx1flvvkxv5QKm2",
        "name": "Keyur"
      }
    ],
    "bio": "",
    "awards": [],
    "skills": [],
    "photoURL": "",
    "courses": [],
    "requests": [],
    "languages": [],
    "volunteerings": [],
    "userId": "dypmxIlR8yTGpB4DzuNXwe21DrA3",
    "notifications": [
      {
        "date": {
          "seconds": 1681804751,
          "nanoseconds": 804000000
        },
        "photoURL": "",
        "viewed": false,
        "notification": "Test_User applied to your job: test Job"
      },
      {
        "date": {
          "seconds": 1681804792,
          "nanoseconds": 624000000
        },
        "notification": "Test_User applied to your job: test Job",
        "photoURL": "",
        "viewed": false
      },
      {
        "photoURL": "",
        "notification": "Test_User applied to your job: test Job",
        "viewed": false,
        "date": {
          "seconds": 1681804903,
          "nanoseconds": 144000000
        }
      },
      {
        "date": {
          "seconds": 1681804903,
          "nanoseconds": 148000000
        },
        "notification": "Test_User applied to your job: test Job",
        "photoURL": "",
        "viewed": false
      },
      {
        "viewed": false,
        "photoURL": "",
        "date": {
          "seconds": 1681804939,
          "nanoseconds": 203000000
        },
        "notification": "Test_User applied to your job: test Job"
      },
      {
        "viewed": false,
        "date": {
          "seconds": 1682002837,
          "nanoseconds": 119000000
        },
        "photoURL": "",
        "notification": "Keyur wants to connect."
      }
    ],
    "works": [],
    "pending": [
      "1VtYx8Nk51XYmcDmbfAGTAMrhJc2",
      "1ra4laQyOkNUTIGCYkbRe1vfiWL2",
      "Tla3CmXbgPT6NSSqd61qDXAevwz1",
      "9SAKagxM8bY7WGILgFcYEnPKUnB2",
      "DnQ3ZPdr72MSQI6PetakyVNedGW2",
      "Fc8SA7LLpbaC6iJCwqBhYvqepoS2",
      "HgFOKYaFhQaBrozGMWWLuYnAdlZ2",
      "OJxdd1cC5tZ83mu6naku3tiYJdo2",
      "TainxNRnx5a0GQ1IDnvfOyd68ae2",
      "ZWx7fTaLFrYJICCtv9jnGWgBTt82",
      "efLT5SqHFkN7PcaoaPPsJa2qWLm1"
    ],
    "savedJobs": [],
    "recommendations": [],
    "educations": [
      {
        "program": "",
        "endDate": "",
        "school": "test",
        "startDate": ""
      }
    ],
    "projects": [],
    "displayName": "Keyur P",
    "searchingPreferences": {
      "remoteWorkOption": "",
      "industry": "",
      "experienceLevel": "",
      "jobType": ""
    },
    "mail": "keyur01@yopmail.com"
  }
}

Enzyme.configure({ adapter: new Adapter() })
describe('UpdateConnections', () => {
  it('should render "Connections" header', () => {
    render(<UpdateConnections {...props} />);
    const headerElement = screen.getByText('Connections');
    expect(headerElement).toBeInTheDocument();
  });

  it('should render connections list', () => {
    const wrapper = render(<UpdateConnections {...props} />);
    const connectionItems = wrapper.getAllByRole('listitem');
    expect(connectionItems.length).toBe(props.user.connections.length);
  });

  it('should delete a connection when delete button is clicked', () => {
    const removeConnectionById = jest.fn()
    const wrapper = render(<UpdateConnections {...props} removeConnectionById={removeConnectionById} />);
    const deleteButton = wrapper.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    expect(removeConnectionById).toHaveBeenCalledTimes(1)
    // const connectionItems = screen.getAllByRole('listitem');
    // expect(connectionItems.length).toBe(1);
  });
});
