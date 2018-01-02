// Copyright 2017, David Hoelzer/Enclave Forensics Corporation - All Rights Reserved
// No portion of this code may be used in any commercial product without first notifying Enclave Forensics Corporation
// and clear attribution and credit for portions copied or otherwise utilized.

export class TopPorts {
	constructor(
		public port: string,
		public packets: number,
		public _percent: string,
		public _tally: string
	) {}
}