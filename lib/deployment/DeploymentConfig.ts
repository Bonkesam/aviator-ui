// lib/deployment/DeploymentConfig.ts
export interface DeploymentConfig {
  environment: 'development' | 'staging' | 'production';
  version: string;
  buildTime: string;
  gitCommit: string;
  features: {
    analytics: boolean;
    monitoring: boolean;
    errorTracking: boolean;
    performanceTracking: boolean;
    a11y: boolean;
  };
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  blockchain: {
    network: string;
    rpcUrl: string;
    chainId: number;
    contracts: {
      aviator: string;
      vrfConsumer: string;
    };
  };
  security: {
    csp: boolean;
    hsts: boolean;
    xFrameOptions: boolean;
    contentTypeNoSniff: boolean;
  };
}

export const deploymentConfig: DeploymentConfig = {
  environment: (process.env.NODE_ENV as any) || 'development',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  buildTime: process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString(),
  gitCommit: process.env.NEXT_PUBLIC_GIT_COMMIT || 'unknown',
  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    monitoring: process.env.NEXT_PUBLIC_ENABLE_MONITORING === 'true',
    errorTracking: process.env.NEXT_PUBLIC_ENABLE_ERROR_TRACKING === 'true',
    performanceTracking: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE === 'true',
    a11y: process.env.NEXT_PUBLIC_ENABLE_A11Y === 'true',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
    retries: parseInt(process.env.NEXT_PUBLIC_API_RETRIES || '3'),
  },
  blockchain: {
    network: process.env.NEXT_PUBLIC_NETWORK || 'sepolia',
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || '',
    chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '11155111'),
    contracts: {
      aviator: process.env.NEXT_PUBLIC_AVIATOR_CONTRACT || '0xDDb3F89a48d3F18683275009A45755627c3fE6bF',
      vrfConsumer: process.env.NEXT_PUBLIC_VRF_CONSUMER || '0x00620972f05dCc747Fc9935d72499CBe4D83AfB1',
    },
  },
  security: {
    csp: process.env.NEXT_PUBLIC_ENABLE_CSP === 'true',
    hsts: process.env.NEXT_PUBLIC_ENABLE_HSTS === 'true',
    xFrameOptions: process.env.NEXT_PUBLIC_X_FRAME_OPTIONS === 'true',
    contentTypeNoSniff: process.env.NEXT_PUBLIC_CONTENT_TYPE_NO_SNIFF === 'true',
  },
};