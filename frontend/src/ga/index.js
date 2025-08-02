import ReactGA from 'react-ga4'

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_ID

export const initGA = () => {
    ReactGA.initialize(GA_MEASUREMENT_ID)
}

export const logPageView = (path) => {
    ReactGA.send({ hitType: 'pageview', page: path })
}
