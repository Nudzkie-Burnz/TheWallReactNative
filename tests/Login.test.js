
import { render, screen, fireEvent } from '@testing-library/react-native';
import LogInScreen from "../app/index";

describe('LogIn', () => {
    it('should allow the user to login', () => {
        render(<LogInScreen/>)
    });
})