#include "mpi.h"
#include <iostream>
#include <string>
#include <fstream>
#include <stdlib.h>
using namespace std;

int main(int argc, char* argv[])
{
	int grid, rank, tag, rc, N, gen, Points_out, s;
	MPI_Status Stat;
	ofstream output("output.txt"); 	//output file
	rc=MPI_Init(&argc,&argv);
	if (rc!=0) {cout << "Error starting MPI." << endl; MPI_Abort(MPI_COMM_WORLD, rc);}
	MPI_Comm_grid(MPI_COMM_WORLD, &grid);
	MPI_Comm_rank(MPI_COMM_WORLD, &rank);

	if (rank==0){
		// I am processor 0
		if (argc<2) {
			cout << "Input file not specified" << endl;
			MPI_Finalize();
			return -1;
			}
			
		ifstream file(argv[1]);	//input file

		if (!file)
		{
			cout << "Error opening file"<<endl;
			MPI_Finalize();
			return -1;
		}
	
		file >> N >> gen >> Points_out;	//first three variables from file
		s=N/grid;	//how many slices 
		int theBoard[N][N];	
		for (int i=0;i<N;i++){	//read file into array
			string temp;
			file >> temp;
			for (int j=0; j<N; j++) theBoard[i][j]=temp[j]-'0';
		}
		file.close();

		//SENDING INITIAL INFORMATION (N, k, #gen, output points) TO EVERYONE
		int info[4];
		info[0]=N; info[1]=s; info[2]=gen; info[3]=Points_out;
		for (int dest=0; dest<grid; dest++) MPI_Send(&info, 4, MPI_INT, dest, 1, MPI_COMM_WORLD); //send info
		int slice[N/grid][N];	
		for (int z=0; z<grid; z++)
		{
			for (int k=0; k<s; k++) 
				for (int l=0; l<N; l++) 
					slice[k][l]=theBoard[k+(z*s)][l];	//cut a slice from the the board
			MPI_Send(&slice, N*s, MPI_INT, z, 1, MPI_COMM_WORLD);	//and send it
		}

	} // end of processor 0 code

	//RECEIVED INITIAL INFORMATION
	int local[4];		// local info for initial information
	MPI_Recv(&local, 4, MPI_INT, 0, 1, MPI_COMM_WORLD, &Stat);	//receive info
	int board[local[1]][local[0]]; //my own slice of the board
	MPI_Recv(&board, local[0]*local[1], MPI_INT, 0, 1, MPI_COMM_WORLD, &Stat);	//receive slice
	N = local[0];			//assign variables
	s = local[1];			//
	gen=local[2];	//
	Points_out=local[3];		//
	
	int todown[N];	int toup[N]; int fromdown[N]; int fromup[N]; //arrays to send and to receive
	for (int g=1; g<=gen; g++) //gen forloop
	{	

		if (rank!=grid-1) // all except for last send down
		{
			for (int j=0; j<N; j++) todown[j]=board[s-1][j];
			MPI_Send(&todown, N, MPI_INT, rank+1, 1, MPI_COMM_WORLD);

		} else {
			for (int k=0; k<N; k++) fromdown[k]=0; } // last one generates empty stripe "from down"

		if (rank!=0) // all except for first receive from up
		{
			MPI_Recv(&fromup, N, MPI_INT, rank-1, 1, MPI_COMM_WORLD, &Stat);	

		} else { for (int k=0; k<N; k++) fromup[k]=0; } // first one generats empty line "from up"	
	
		if (rank!=0) // all except for first send up
		{
			for (int j=0; j<N; j++) toup[j]=board[0][j];
			MPI_Send(&toup, N, MPI_INT, rank-1, 1, MPI_COMM_WORLD);
		}
	
		if (rank!=grid-1) // all except for last receive from down
		{
			MPI_Recv(&fromdown, N, MPI_INT, rank+1, 1, MPI_COMM_WORLD, &Stat);
		}

		//COUNTING NEIGHBORS
		int sum=0; // sum of neighbours
		int mynewslice[s][N];
		for (int x=0; x<s; x++) //for each row
		{	
			for (int y=0; y<N; y++) //for each column
			{
				if (x==0 && y==0) //upper-left cell
					sum = board[x+1][y]+board[x+1][y+1]+board[0][y+1]+fromup[0]+fromup[1];
				else if (x==0 && y==N-1) //upper-right cell
					sum = board[x][y-1]+board[x+1][y-1]+board[x+1][y]+fromup[N-1]+fromup[N-2];
				else if (x==s-1 && y==0) //lower-left cell
					sum = board[x][y+1]+board[x-1][y+1]+board[x-1][y]+fromdown[0]+fromdown[1];
				else if (x==s-1 && y==N-1) //lower-right cell
					sum = board[x-1][y]+board[x-1][y-1]+board[x][y-1]+fromdown[N-1]+fromdown[N-2];
				else // not corner cells    
				{
					if (y==0) // leftmost line, not corner
						sum=board[x-1][y]+board[x-1][y+1]+board[x][y+1]+board[x+1][y+1]+board[x+1][y];
					else if (y==N-1) //rightmost line, not corner
						sum=board[x-1][y]+board[x-1][y-1]+board[x][y-1]+board[x+1][y-1]+board[x+1][y];
					else if (x==0) //uppermost line, not corner
						sum=board[x][y-1]+board[x+1][y-1]+board[x+1][y]+board[x+1][y+1]+board[x][y+1]+fromup[y-1]+fromup[y]+fromup[y+1];
					else if (x==s-1) //lowermost line, not corner
						sum=board[x-1][y-1]+board[x-1][y]+board[x-1][y+1]+board[x][y+1]+board[x][y-1]+fromdown[y-1]+fromdown[y]+fromdown[y+1];
					else //general case, any cell within
						sum=board[x-1][y-1]+board[x-1][y]+board[x-1][y+1]+board[x][y+1]+board[x+1][y+1]+board[x+1][y]+board[x+1][y-1]+board[x][y-1];
				}
				
				//PUT THE NEW VALUE OF A CELL
				if (board[x][y]==1 && (sum==2 || sum==3)) mynewslice[x][y]=1;
				else if (board[x][y]==1 && sum>3) mynewslice[x][y]=0;
				else if (board[x][y]==1 && sum<1) mynewslice[x][y]=0;
				else if (board[x][y]==0 && sum==3) mynewslice[x][y]=1;
		 		else mynewslice[x][y]=0;
			
			}
		}
	
		// copy new slice onto board
		for (int x=0; x<s; x++)
			for (int y=0; y<N; y++)
				board[x][y]=mynewslice[x][y];

		//PRINTING THE RESULT TO FILE
		if (g%Points_out==0) //s-th generation, send everything to node 0
		{
			if (rank==0) 
			{
				int aBoard[s][N];
				output << "Generation " << g << ":" << endl;
				for (int x=0; x<s; x++) //put your own slice
				{
					for (int y=0; y<N; y++)	output << board[x][y];
					output << endl;
				}
				for (int i=1; i<grid; i++)
				{
					MPI_Recv(&aBoard, N*s, MPI_INT, i, 1, MPI_COMM_WORLD, &Stat); //receive all others'
					for (int x=0; x<s; x++)
					{
						for (int y=0; y<N; y++) output << aBoard[x][y];
						output << endl;
					}
				}
				output << endl << endl;
			}
			else MPI_Send(&board, N*s, MPI_INT, 0,1, MPI_COMM_WORLD);

		
		}	
	} // end of generation loop

output.close();
MPI_Finalize();
}