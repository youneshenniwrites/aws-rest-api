import {
  APIGatewayClient,
  GetExportCommand,
  GetExportCommandOutput,
} from "@aws-sdk/client-api-gateway";

class ApiDocsService {
  private restApiId: string;
  private apigateway: APIGatewayClient;

  constructor(restApiId: string) {
    this.restApiId = restApiId;
    this.apigateway = new APIGatewayClient({});
  }

  async getApiDocs(): Promise<GetExportCommandOutput> {
    const params = {
      restApiId: this.restApiId,
      exportType: "swagger",
      accepts: "application/json",
      stageName: "prod",
    };

    const getExportCommand = new GetExportCommand(params);
    const apiDocs = await this.apigateway.send(getExportCommand);

    return apiDocs;
  }
}

const restApiId = process.env.API_ID!;
export const apiDocsService = new ApiDocsService(restApiId);
