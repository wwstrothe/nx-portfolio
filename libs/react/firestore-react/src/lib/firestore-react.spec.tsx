import {
    firestoreAddByPath,
    firestoreGetByPath,
    firestoreListCollection,
} from './firestore-react';

describe('Firestore React', () => {
  it('should export firestore functions', () => {
    expect(firestoreGetByPath).toBeDefined();
    expect(firestoreListCollection).toBeDefined();
    expect(firestoreAddByPath).toBeDefined();
  });
});
