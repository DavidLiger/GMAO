import {Button} from 'flowbite-react';

const theme = {
    color: {
        primary: 'border border-transparent bg-primary text-white focus:ring-4 focus:ring-primary-300 enabled:hover:bg-primary-800 dark:bg-primary-600 dark:focus:ring-primary-800 dark:enabled:hover:bg-primary-700',
    }
}

const BioButton = ({color = "default", ...props}) => {
    return <Button theme={theme} color={color} {...props} />;
};

export default BioButton;