module.exports = (deployer) => {
  deployer.deploy(Wallet);
  deployer.autolink();
};
