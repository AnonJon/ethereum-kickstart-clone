import React, { useState, useEffect } from "react";
import factory from "../ethereum/factory";
import { Card, Button } from "semantic-ui-react";
import Layout from "../components/Layout";
import { Link } from "../routes";

const CampaignIndex = ({ awaitCampaigns }) => {
  const [campaigns, setCampaigns] = useState([]);

  const rendarCampaigns = () => {
    const items = awaitCampaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
        style: { overflowWrap: "break-world" },
      };
    });
    return <Card.Group items={items} />;
  };

  useEffect(() => {
    async function wrapper() {
      const awaitCampaigns1 = await factory.methods
        .getDeployedCampaigns()
        .call();
      setCampaigns(awaitCampaigns1);
    }
    wrapper();
  }, []);

  return (
    <Layout>
      <div>
        <h3>Open campaigns</h3>
        <Link route="/campaigns/new">
          <a>
            <Button
              floated="right"
              content="Create Campaign"
              icon="add"
              primary
              style={{ marginLeft: 20 }}
            />
          </a>
        </Link>
        {rendarCampaigns()}
      </div>
    </Layout>
  );
};

//server side rendering with getInitialProps
CampaignIndex.getInitialProps = async () => {
  const awaitCampaigns = await factory.methods.getDeployedCampaigns().call();
  return { awaitCampaigns };
};

export default CampaignIndex;
