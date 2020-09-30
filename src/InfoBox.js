import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import './InfoBox.css'

function InfoBox({ title, cases, isRed, active, total, ...props }) {
    return (
        <Card className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`} onClick={props.onClick}>
            <CardContent>
                {/* title */}
                <Typography className="infoBox_title" color="textSecondary">
                    {title}
                </Typography>
                {/* ++Number */}
                <h2 className={`infoBox_cases ${!isRed && "infoBox_cases--green"}`}>{cases}</h2>

                {/* total */}
                <Typography className="infoBox_total" color="textSecondary"> 
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
