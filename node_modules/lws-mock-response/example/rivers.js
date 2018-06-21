module.exports = MockBase => class MockRivers extends MockBase {
  mocks () {
    return {
      route: '/rivers',
      responses: [
        {
          response: { type: 'json', body: [
            { name: 'Volga', drainsInto: 'Caspian Sea' },
            { name: 'Danube', drainsInto: 'Black Sea' },
            { name: 'Ural', drainsInto: 'Caspian Sea' },
            { name: 'Dnieper', drainsInto: 'Black Sea' }
          ]}
        }
      ]
    }
  }
}
