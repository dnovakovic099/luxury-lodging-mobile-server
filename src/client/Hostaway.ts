import axios from "axios";
import logger from "../config/winstonLoggerConfig";

export class HostAwayClient {


    private async getAccessToken(clientId: string, clientSecret: string): Promise<string | null> {
        const url = "https://api.hostaway.com/v1/accessTokens";
        const data = {
            grant_type: "client_credentials",
            client_id: clientId,
            client_secret: clientSecret,
            scope: "general",
        };

        try {
            const response = await axios.post(url, new URLSearchParams(data).toString(), {
                headers: {
                    "Cache-control": "no-cache",
                    "Content-type": "application/x-www-form-urlencoded",
                },
            });

            return response.data?.access_token;
        } catch (error) {
            logger.error('Error getting access token from hostaway');
            return null;
        }
    }


    public async getListing(clientId: string, clientSecret: string) {
        try {
            const url = `https://api.hostaway.com/v1/listings`;
            const token = await this.getAccessToken(clientId, clientSecret);
            if (!token) {
                throw new Error("Failed to get access token");
            }

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Cache-control": "no-cache",
                },
            });
            return response.data.result;
        } catch (error) {
            logger.error('Error fetching listing from hostaway', error);
            throw error;
        }
    }

    public async getReservations(
        clientId: string,
        clientSecret: string,
        listingId: number | "",
        dateType: string,
        startDate: string,
        endDate: string,
        limit: number,
        offset: number,
        channelId: number | ""
    ): Promise<Object[] | null> {

        let url = `https://api.hostaway.com/v1/reservations?${dateType}StartDate=${startDate}&${dateType}EndDate=${endDate}&limit=${limit}&offset=${offset}&sortOrder=${dateType}DateDesc`;

        if (listingId) {
            url += `&listingId=${listingId}`;
        }

        if (channelId) {
            url += `&channelId=${channelId}`;
        }

        try {
            const token = await this.getAccessToken(clientId, clientSecret);
            if (!token) {
                throw new Error("Failed to get access token");
            }

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Cache-control": "no-cache",
                },
            });

            return response.data?.result;
        } catch (error) {
            logger.error('Error fetching reservations from hostaway', error);
            return null;
        }
    }

    public async getListingByUserId(userId: number, clientId: string, clientSecret: string) {
        let url = `https://api.hostaway.com/v1/listings?userId=${userId}`;

        try {
            const token = await this.getAccessToken(clientId, clientSecret);
            if (!token) {
                throw new Error("Failed to get access token");
            }

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Cache-control": "no-cache",
                },
            });

            return response.data.result;
        } catch (error) {
            logger.error('Error fetching listing by userId from hostaway', error);
            return null;
        }
    }

    public async getExpenses(clientId: string, clientSecret: string, limit: number = 500) {
        let expenses: any[] = [];
        let offset = 0;
        let hasMoreData = true;

        try {
            const token = await this.getAccessToken(clientId, clientSecret);
            if (!token) {
                throw new Error("Failed to get access token");
            }

            while (hasMoreData) {
                const url = `https://api.hostaway.com/v1/expenses?limit=${limit}&offset=${offset}`;

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Cache-control": "no-cache",
                    },
                });

                const fetchedExpenses = response.data.result;

                // Add fetched expenses to the array
                expenses = expenses.concat(fetchedExpenses);

                // Check if there is more data
                if (fetchedExpenses.length < limit) {
                    hasMoreData = false; // No more data if the last page contains less than `limit`
                } else {
                    offset += limit; // Update offset for the next page
                }
            }

            return expenses;
        } catch (error) {
            logger.error('Error fetching expenses from hostaway', error);
            return null;
        }
    }


}


