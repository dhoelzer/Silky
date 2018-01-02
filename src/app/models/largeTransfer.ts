// Copyright 2017, David Hoelzer/Enclave Forensics Corporation - All Rights Reserved
// No portion of this code may be used in any commercial product without first notifying Enclave Forensics Corporation
// and clear attribution and credit for portions copied or otherwise utilized.

export class LargeTransfer {
	constructor(
		public source: string,
		public sport: number,
		public dest: string,
		public dport: number,
		public bytes: number,
		public _percent: string,
		public _tally: string
	) {}
}