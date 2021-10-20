exports.AlgoritmoOperaciones = function(DBTM0, DMEA, DBTM, RPM, ROPA, MFIA, TQA, WOB)
{
	var Operacion = '';
	var CampoOper = '';
	var salida = '';

	if (DBTM == -999.25 || DMEA == -999.25 || MFIA == -999.25 || RPM == -999.25 || TQA == -999.25 || ROPA == -999.25 || WOB == -999.25 ) {
		Operacion = 41;
		CampoOper = 'Unregistred';
		//continue Final;
	}

	if (DBTM <= 0)
	{
		Operacion = 35;
		CampoOper = 'On Surface';
		//continue Final;
	}
	else
	{
		if (DMEA > 0)
		{
			if (DBTM == DMEA)
			{
				if ((ROPA > 0) && (WOB >= 0))
				{
					if ((RPM > 0) && (TQA > 0)) {Operacion = 2; CampoOper = 'Drilling';
					}
					else
					{
						Operacion = 36;
						CampoOper = 'Sliding';
					}
				}
				else
				{
					if (MFIA > 0)
					{
						Operacion = 7;
						CampoOper = 'Circulating';
					}
					else
					{
						Operacion = 3;
						CampoOper = 'Connection';
					}
				}
			}
			else
			{
				if (DBTM < DBTM0)
				{
					if (RPM > 0)
					{
						Operacion = 39;
						CampoOper = 'BackReaming';
					}
					else
					{
						if (MFIA > 0)
						{
							Operacion = 37;
							CampoOper = 'POOH W/Pump';
						}
						else
						{
							Operacion = 9;
							CampoOper = 'POOH';
						}
					}
				}
				else
				{
					if(DBTM > DBTM0)
					{
						if(RPM > 0)
						{
							Operacion = 4;
							CampoOper = 'Reaming';
						}
						else
						{
							if(MFIA > 0)
							{
								Operacion = 38;
								CampoOper = 'RIH W/Pump';
							}
							else
							{
								Operacion = 8;
								CampoOper = 'RIH';
							}
						}
					}
					else
					{
						if(DBTM == DBTM0)
						{
							if(MFIA > 0)
							{
								Operacion = 7;
								CampoOper = 'Circulating';
							}
							else
							{
								Operacion = 3;
								CampoOper = 'Connection';
							}
						}
						else
						{
							Operacion = 0;
							CampoOper = 'Undef status';
						}
					}
				}
			}
		}
		else
		{
			Operacion = 35;
			CampoOper = 'On Surface';
		}
	}

  	salida = { "Operacion":  Operacion , "nombreOperacion":  CampoOper  };
	return salida;
}