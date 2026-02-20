declare module '*.css';

declare module '*.svg' {
    const content: string;
    export default content;
}

// Workaround for old 'react-intl' version. Newer versions include proper types.
interface IntlShape {
    formatMessage: ({id: string, defaultMessage: string}) => string;
}
